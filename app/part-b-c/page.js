"use client"; // Enables client-side rendering
import { useState, useEffect } from "react";

export default function PartBForm() {
  // State for all form inputs
  const [formData, setFormData] = useState({
    eircode: "",
    appliance: "",
    brand: "",
    model: "",
    serial: "",
    purchaseDate: "",
    warrantyDate: ""
  });

  // Object to store all errors, including date errors
  const [errors, setErrors] = useState({});

  const [message, setMessage] = useState(""); // Server success/error messages
  const [addedAppliance, setAddedAppliance] = useState(null); // Store appliance details

  const [allAppliances, setAllAppliances] = useState([]); // Extra endpoint data

  // Fetch data from extra endpoint
  useEffect(() => {
    const fetchAppliances = async () => {
      try {
        const res = await fetch("/api/extra-endpoint");
        if (res.ok) {
          const data = await res.json();
          setAllAppliances(data.appliances || []);
        }
      } catch (err) {
        console.log("Failed to fetch appliances", err);
      }
    };
    fetchAppliances();
  }, []);

  // Validate a single field (called on change)
  const validateField = (name, value) => {
    let error = "";

    if (!value) {
      error = `${name} is required`;
    }

    if (name === "warrantyDate" && formData.purchaseDate && new Date(value) < new Date(formData.purchaseDate)) {
      error = "Warranty date cannot be before purchase date";
    }

    if (name === "eircode" && value && !/^[A-Z]\d{2}\s?\d{4}$/.test(value)) {
      error = "Enter a valid Irish Eircode";
    }

    if (name === "brand" && value && !/^[A-Za-z\s]{2,20}$/.test(value)) {
      error = "Brand must contain only letters (2-20 chars)";
    }

    if (name === "model" && value && !/^\d{3}-\d{3}-\d{4}$/.test(value)) {
      error = "Format: 000-000-0000";
    }

    if (name === "serial" && value && !/^\d{4}-\d{4}-\d{4}$/.test(value)) {
      error = "Format: 0000-0000-0000";
    }

    return error;
  };

  // Handle input changes (inline validation)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate the field immediately
    const fieldError = validateField(name, value);
    setErrors({ ...errors, [name]: fieldError });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setAddedAppliance(null);

    // Validate all fields before submitting
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit data to backend
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Validation failed");
        return;
      }

      setAddedAppliance(data.appliance);
      setMessage("Appliance added successfully!");

      // Reset form fields
      setFormData({
        eircode: "",
        appliance: "",
        brand: "",
        model: "",
        serial: "",
        purchaseDate: "",
        warrantyDate: ""
      });

      setErrors({});
    } catch (err) {
      setMessage("Something went wrong. Try again");
    }
  };

  return (
    <div className="text-gray-900 font-medium p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">House Appliance Inventory</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Eircode */}
        <div>
          <label>Eircode</label>
          <input
            type="text"
            name="eircode"
            value={formData.eircode}
            onChange={handleChange}
            required
            pattern="^[A-Z]\d{2}\s?\d{4}$"
            title="Enter a valid Irish Eircode"
          />
          {errors.eircode && <p style={{ color: "red" }}>{errors.eircode}</p>}
        </div>

        {/* Appliance */}
        <div>
          <label>Appliance</label>
          <select
            name="appliance"
            value={formData.appliance}
            onChange={handleChange}
            required
          >
            <option value="">Select an appliance</option>
            <option value="fridge">Fridge</option>
            <option value="cooker">Cooker</option>
            <option value="microwave">Microwave</option>
            <option value="dishwasher">Dishwasher</option>
            <option value="washing_machine">Washing Machine</option>
          </select>
          {errors.appliance && <p style={{ color: "red" }}>{errors.appliance}</p>}
        </div>

        {/* Brand */}
        <div>
          <label>Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />
          {errors.brand && <p style={{ color: "red" }}>{errors.brand}</p>}
        </div>

        {/* Model */}
        <div>
          <label>Model Number</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
          />
          {errors.model && <p style={{ color: "red" }}>{errors.model}</p>}
        </div>

        {/* Serial */}
        <div>
          <label>Serial Number</label>
          <input
            type="text"
            name="serial"
            value={formData.serial}
            onChange={handleChange}
            required
          />
          {errors.serial && <p style={{ color: "red" }}>{errors.serial}</p>}
        </div>

        {/* Purchase Date */}
        <div>
          <label>Purchase Date</label>
          <input
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate || ""}
            onChange={handleChange}
            required
          />
          {errors.purchaseDate && <p style={{ color: "red" }}>{errors.purchaseDate}</p>}
        </div>

        {/* Warranty Date */}
        <div>
          <label>Warranty Expiration Date</label>
          <input
            type="date"
            name="warrantyDate"
            value={formData.warrantyDate || ""}
            onChange={handleChange}
            required
          />
          {errors.warrantyDate && <p style={{ color: "red" }}>{errors.warrantyDate}</p>}
        </div>

        <button type="submit">Add to Inventory</button>
      </form>

      {/* Server messages */}
      {message && <p>{message}</p>}

      {/* Display appliance details */}
      {addedAppliance && (
        <div style={{ marginTop: "20px" }}>
          <h3>Appliance Added:</h3>
          <p>Eircode: {addedAppliance.eircode}</p>
          <p>Appliance: {addedAppliance.appliance}</p>
          <p>Brand: {addedAppliance.brand}</p>
          <p>Model: {addedAppliance.model}</p>
          <p>Serial: {addedAppliance.serial}</p>
          <p>Purchase Date: {addedAppliance.purchaseDate}</p>
          <p>Warranty Expiration Date: {addedAppliance.warrantyDate}</p>
        </div>
      )}

      {/* Display all appliances from extra-endpoint */}
      {allAppliances.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>All Appliances:</h3>
          <ul>
            {allAppliances.map((appl, idx) => (
              <li key={idx}>{appl.appliance} ({appl.brand} - {appl.model})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}