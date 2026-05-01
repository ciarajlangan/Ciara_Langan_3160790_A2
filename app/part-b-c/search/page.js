// app/appliance/search/page.js
"use client";

import { useState } from "react";
import Link from "next/link";

export default function SearchAppliancePage() {

  //Stores user input (serial number)-----------------
  const [serialNumber, setSerialNumber] = useState("");

  //Stores the result returned from the API
  const [result, setResult] = useState(null);

  //Stores general messages (success / not found)
  const [message, setMessage] = useState("");

  //Stores validation error message
  const [error, setError] = useState("");

  //REGEX VALIDATION FUNCTION----------------------------
  const validateSerial = (value) => {
    //Ensures serial number is in the format: 0000-0000-0000
    return /^\d{4}-\d{4}-\d{4}$/.test(value);
  };

  //Handle Search Submit-------------
  const handleSearch = async (e) => {
    e.preventDefault();

    //Reset previous results/messages
    setMessage("");
    setResult(null);

    //Validate input before sending request---------------------
    if (!validateSerial(serialNumber)) {
      setError("Serial number must be in format 0000-0000-0000");
      return;
    }

    setError("");

    //Calls backend API (GET request with query parameter)----------------
    const res = await fetch(`/api/appliance?serialNumber=${serialNumber}`);
    const data = await res.json();

    //If appliance not found or error occurs
    if (!res.ok) {
      setMessage(data.message || "No matching appliance found!");
      return;
    }

    //Save result for display
    setResult(data.appliance);
  };

  //Format Date Function (YYYY-MM-DD -> DD/MM/YYYY)
  const formatDate = (dateString) => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

  return (
    <div className="text-gray-900 font-medium p-6 max-w-2xl mx-auto space-y-6">

      {/*Page Title */}
      <h1 className="text-2xl font-bold">Search Appliance</h1>

      {/*Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label>Serial Number</label>

          {/*Input field for serial number */}
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            required

            //HTML validation to match regex
            pattern="\d{4}-\d{4}-\d{4}"
            title="Format: 0000-0000-0000"
          />

          {/*Display validation error */}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

        {/*Submit button */}
        <button type="submit">Search</button>
      </form>

      {/*Display message */}
      {message && <p>{message}</p>}

      {/*Display result if not found */}
      {result && (
        <div>
          <h3>Appliance Found:</h3>

          {/*Appliance details */}
          <p>Type: {result.ApplianceType}</p>
          <p>Brand: {result.Brand}</p>
          <p>Model: {result.ModelNumber}</p>
          <p>Serial: {result.SerialNumber}</p>

          {/*Formatted dates */}
          <p>Purchase Date: {formatDate(result.PurchaseDate)}</p> 
          <p>Warranty Date: {formatDate(result.WarrantyExpiration)}</p>

          {/*Cost */}
          <p>Cost: €{result.Cost}</p>

          {/*Linked user details (JOIN from users table) */}
          <p>User: {result.FirstName} {result.LastName}</p>
        </div>
      )}

      {/*Navigation back to homepage */}
      <Link href="/">Back to Homepage</Link>
    </div>
  );
}