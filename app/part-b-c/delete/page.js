//app/appliance/delete/page.js
"use client";

import { useState } from "react";
import Link from "next/link";

export default function DeleteAppliancePage() {

  //Stores the serial number entered by user
  const [serialNumber, setSerialNumber] = useState("");

  //Stores the appliance returned from the database (for confirmation)
  const [appliance, setAppliance] = useState(null);

  //Stores success/error messages to display to user
  const [message, setMessage] = useState("");

  //REGEX VALIDATION------------------------------------
  const validateSerial = (value) => {
    // Allows serial numbers in the format 0000-0000-0000
    return /^\d{4}-\d{4}-\d{4}$/.test(value);
  };

  //FIND APPLIANCE BY SERIAL NUMBER---
  const findAppliance = async (e) => {
    e.preventDefault();

    //Validate before sending request-----------------------------
    if (!validateSerial(serialNumber)) {
      setMessage("Serial number must be in format 0000-0000-0000");
      return;
    }

    //Call API GET endpoint-----------------------------------------------
    const res = await fetch(`/api/appliance?serialNumber=${serialNumber}`);
    const data = await res.json();

    //If no appliance found---------------------
    if (!res.ok) {
      setMessage("No matching appliance found!");
      setAppliance(null);
      return;
    }

    //Save appliance data for confirmation display
    setAppliance(data.appliance);
    setMessage("");
  };

  //DELTE APPLIANCE AFTER CONFIRMATION---------------
  const deleteAppliance = async () => {

    //Call Delete API--------------------------------
    const res = await fetch("/api/appliance", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },

      //Sends serial number to backend to delete
      body: JSON.stringify({ serialNumber }),
    });

    const data = await res.json();

    //Show success message-------------------------
    setMessage(data.message || "Appliance Deleted");

    //Reset state after deletion
    setAppliance(null);
    setSerialNumber("");
  };

  //UI DISPLAY-----------------------------------------------------------------
  return (
    <div className="text-gray-900 font-medium p-6 max-w-2xl mx-auto space-y-6">

      {/*Page Title */}
      <h1 className="text-2xl font-bold">Delete Appliance</h1>

      {/*FORM: User enters serial number */}
      <form onSubmit={findAppliance} className="space-y-4">
        <div>
          <label>Serial Number</label>

          {/*Input field for serial */}
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

      {/*Confirmation Section */}
      {appliance && (
        <div>
          <h3>Confirm Delete:</h3>

          {/*Display appliance details before deletion */}
          <p>Type: {appliance.ApplianceType}</p>
          <p>Brand: {appliance.Brand}</p>
          <p>Model: {appliance.ModelNumber}</p>
          <p>Serial: {appliance.SerialNumber}</p>

          {/*User confirms deletion */}
          <button onClick={deleteAppliance}>
            Confirm Delete
          </button>
        </div>
      )}

      {/* Display success or error message */}
      {message && <p>{message}</p>}

      {/* Navigation back to homepage */}
      <Link href="/">Back to Homepage</Link>
    </div>
  );
}