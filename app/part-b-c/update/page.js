"use client";

import { useState } from "react";
import Link from "next/link";

export default function UpdateAppliancePage() {

  //Stores serial number entered by user (used to find appliance)
  const [serialNumber, setSerialNumber] = useState("");

  //Stores appliance + user data returned from API (for editing)
  const [form, setForm] = useState(null);

  //Stores messages (success/ error)
  const [message, setMessage] = useState("");

  //Validate serial number format
  const validateSerial = (value) => {
    //format must be 0000-0000-0000
    return /^\d{4}-\d{4}-\d{4}$/.test(value);
  };

  //Validate brand input
  const validateBrand = (value) => {
    // Allows letters and spaces, between 2 and 30 characters
    return /^[A-Za-z\s]{2,30}$/.test(value);
  };

  //Find appliance serial number---------------------------------
  const findAppliance = async (e) => {
    e.preventDefault();

    //Validate serial before searching----------------------------
    if (!validateSerial(serialNumber)) {
      setMessage("Serial number must be in format 0000-0000-0000");
      return;
    }

    //Calls backend GET endpoint 
    const res = await fetch(`/api/appliance?serialNumber=${serialNumber}`);
    const data = await res.json();

    //If no appliance found 
    if (!res.ok) {
      setMessage("No matching appliance found!");
      setForm(null);
      return;
    }

    //Store appliance data for editing
    setForm(data.appliance);
    setMessage("");
  };

  //Handle input changes (updates form state)
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //Update Appliance + User-----------------------------------------
  const updateAppliance = async (e) => {
    e.preventDefault();

    //Validate brand before sending update--------------------------
    if (!validateBrand(form.Brand)) {
      setMessage("Brand must contain only letters, 2-30 characters");
      return;
    }

    //Send updated data to backend-------------------
    const res = await fetch("/api/appliance", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    //Display confirmation message 
    setMessage(data.message || "Appliance has been updated");
  };

  //UI Display-----------------------------------------------------------------
  return (
    <div className="text-gray-900 font-medium p-6 max-w-2xl mx-auto space-y-6">

      {/*Page Title */}
      <h1 className="text-2xl font-bold">Update Appliance</h1>

      {/*Search Form */}
      <form onSubmit={findAppliance} className="space-y-4">
        <div>
          <label>Enter Serial Number</label>

          {/*User inputs serial number to find appliance */}
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            required
          />
        </div>

        {/*Button triggers search */}
        <button type="submit">Find Appliance</button>
      </form>

      {/*Show form ONLY IF appliance found */}
      {form && (
        <form onSubmit={updateAppliance} className="space-y-4">

          {/*Appliance fields (editable) */}
          <div>
            <label>Appliance Type</label>
            <select name="ApplianceType" value={form.ApplianceType || ""} onChange={handleChange}>
              <option value="fridge">Fridge</option>
              <option value="cooker">Cooker</option>
              <option value="microwave">Microwave</option>
              <option value="dishwasher">Dishwasher</option>
             <option value="washing_machine">Washing Machine</option>
            </select>
          </div>    

          <div>
            <label>Brand</label>
            <input name="Brand" value={form.Brand || ""} onChange={handleChange} />
          </div>

          <div>
            <label>Model Number</label>
            <input name="ModelNumber" value={form.ModelNumber || ""} onChange={handleChange} />
          </div>

          <div>
            <label>Warranty Expiration Date</label>
            <input type="date" name="WarrantyExpiration" value={form.WarrantyExpiration?.split("T")[0] || ""} onChange={handleChange} />
          </div>

          <div>
            <label>Cost</label>
            <input type="number" step="0.01" name="Cost" value={form.Cost || ""} onChange={handleChange} />
          </div>

          {/*User Fields (editable) */}
          <div>
            <label>First Name</label>
            <input name="FirstName" value={form.FirstName || ""} onChange={handleChange} />
          </div>

          <div>
            <label>Last Name</label>
            <input name="LastName" value={form.LastName || ""} onChange={handleChange} />
          </div>

          <div>
            <label>Address</label>
            <input name="Address" value={form.Address || ""} onChange={handleChange} />
          </div>

          <div>
            <label>Mobile</label>
            <input name="Mobile" value={form.Mobile || ""} onChange={handleChange} />
          </div>

          <div>
            <label>Email</label>
            <input type="email" name="Email" value={form.Email || ""} onChange={handleChange} />
          </div>

          <div>
            <label>Eircode</label>
            <input name="Eircode" value={form.Eircode || ""} onChange={handleChange} />
          </div>

          <button type="submit">Update Appliance</button>
        </form>
      )}


      {/*Display success/error message */}
      {message && <p>{message}</p>}

      {/*Navigation back to homepage */}
      <Link href="/">Back to Homepage</Link>
    </div>
  );
}