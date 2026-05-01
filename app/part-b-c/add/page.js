"use client"; //Enabling client-side React for (useState/useEffect)

import { useState, useEffect } from "react";

export default function AddPage() {

//User State (users table)----------
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    address: "",
    mobile: "",
    email: "",
    eircode: "",
  });

  //Appliance State (appliance table)
  const [form, setForm] = useState({
    userID: "",
    applianceType: "",
    brand: "",
    modelNumber: "",
    serialNumber: "",
    purchaseDate: "",
    warrantyDate: "",
    cost: "",
  });

  //Store all users for dropdown selection
  const [users, setUsers] = useState([]);

  //Store validation errors----------------
  const [errors, setErrors] = useState({});

  //Store success/error messages from backend ONLY FOR UNDER USER FORM
  const [userMessage, setUserMessage] = useState("");

  //Store success/error messages from backend ONLY FOR UNDER APPLIANCE FORM
  const [applianceMessage, setApplianceMessage] = useState("");


  //Fetch users (on page load)-------------
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();

      //Save users into state for dropdown
      setUsers(data.users || []);
    };

    fetchUsers();
  }, []); //runs once component loads

  //VALIDATION REGEX-----------------------------------
  const validateField = (name, value) => {
    if (!value) return `${name} is required`;

    //Allows letters and spaces (2-30 characters)----
    if (name === "firstName" || name === "lastName") {
      return /^[A-Za-z\s]{2,30}$/.test(value)
        ? ""
        : "Only letters, 2-30 characters";
    }

    //Allows normal email format (name@email.com)
    if (name === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? ""
        : "Invalid email";
    }

    //Allows Irish mobile format beginning with 08 and 10 digits total
    if (name === "mobile") {
      return /^08\d{8}$/.test(value)
        ? ""
        : "Must be 08XXXXXXXX";
    }

    //Allows Irish Eircode format
    if (name === "eircode") {
      return /^[A-Z]\d{2}\s?\d{4}$/i.test(value) //Example: D02 1234
        ? ""
        : "Invalid Eircode";
    }

    //Allows only listed appliance types (dropdown)
    if (name === "applianceType") {
      return value ? "" : "Please select an appliance";
    }

    //Allows brand names with letters and spaces
    if (name === "brand") {
      return /^[A-Za-z\s]{2,30}$/.test(value)
        ? ""
        : "Letters only, 2-30 characters";
    }

    //Allows model format 000-000-0000
    if (name === "modelNumber") {
      return /^\d{3}-\d{3}-\d{4}$/.test(value)
        ? ""
        : "Use format 000-000-0000";
    }

    //Allows serial format 0000-0000-0000
    if (name === "serialNumber") {
      return /^\d{4}-\d{4}-\d{4}$/.test(value)
        ? ""
        : "Use format 0000-0000-0000";
    }

    if (name === "purchaseDate" || name === "warrantyDate") {
      return value ? "" : "Invalid date";
    }

    //Allows numbers with optional 2 decimal places
    if (name === "cost") {
      return /^\d+(\.\d{1,2})?$/.test(value)
        ? ""
        : "Invalid cost";
    }

    return "";
  };

  //Handles user input--------------------------------
  const handleUserChange = (e) => {
    const { name, value } = e.target;

    //Update user state----------------
    setUser({ ...user, [name]: value });

    //Validate field immediately---------------------
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  //Handles appliance input---------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    //Update appliance form state------
    setForm({ ...form, [name]: value });

    //Validate field---------------------------------
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  //Add user (POST-> /api/users)---------------------
  const addUser = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();

    if (!res.ok) {
      setUserMessage(data.error || data.message);
      return;
    }

    //Add new user to dropdown list
    setUsers((prev) => [...prev, data.user]);

    //Success message for user form
    setUserMessage("User added successfully");
  };

  //Add appliance (POST-> /api/appliance)------------
  const addAppliance = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/appliance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setApplianceMessage(data.error || data.message);
      return;
    }

    //Success message for appliance form
    setApplianceMessage("New appliance added successfully");
  };

  //UI (Forms)-----------------------------------------------------------------
  return (
    <div className="text-gray-900 font-medium p-6 max-w-2xl mx-auto space-y-6">

      {/*Page title*/}
      <h1 className="text-2xl font-bold mb-4">House Appliance Inventory</h1>

      {/*User Form----------------------------------------------------------------------------*/ }
      <div>
        <h2 className="text-xl font-bold">Add User</h2>

        <form onSubmit={addUser} className="space-y-4">
        
          {/*First Name */}
          <div>
            <label>First Name</label>
            <input name="firstName" value={user.firstName} onChange={handleUserChange} required />
            {errors.firstName && <p style={{ color: "red" }}>{errors.firstName}</p>}
          </div>

          {/*Last Name */}
          <div>
            <label>Last Name</label>
            <input name="lastName" value={user.lastName} onChange={handleUserChange} required />
            {errors.lastName && <p style={{ color: "red" }}>{errors.lastName}</p>}
          </div>

          {/*Address */}
          <div>
            <label>Address</label>
            <input name="address" value={user.address} onChange={handleUserChange} required />
            {errors.address && <p style={{ color: "red" }}>{errors.address}</p>}
          </div>

          {/*Mobile */}
          <div>
            <label>Mobile</label>
            <input name="mobile" value={user.mobile} onChange={handleUserChange} required />
            {errors.mobile && <p style={{ color: "red" }}>{errors.mobile}</p>}
          </div>

          {/*Email */}
          <div>
            <label>Email</label>
            <input type="email" name="email" value={user.email} onChange={handleUserChange} required />
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
          </div>

          {/*Eircode */}
          <div>
            <label>Eircode</label>
            <input name="eircode" value={user.eircode} onChange={handleUserChange} required />
            {errors.eircode && <p style={{ color: "red" }}>{errors.eircode}</p>}
          </div>

          <button type="submit">Add User</button>

          {/*Display user success message  */}
          {userMessage && <p>{userMessage}</p>} 
        </form>
      </div>


      {/*Appliance Form ----------------------------------------------------------------*/}
      <div>
        <h2 className="text-xl font-bold">Add Appliance</h2>

        <form onSubmit={addAppliance} className="space-y-4">

          <div>
            <label>User</label>
            {/*-------------------------------------------------------------------------
             User Dropdown to select an existing user (Foreign Key Selection) 
             This value will be the UserID (foreign key) stored in the appliance table.
            --------------------------------------------------------------------------*/}
            <select 
            name="userID"                //matches form.userID state
            value={form.userID}          //controlled input (React state)
            onChange={handleChange}      //updates state when user selects an option
            required                     //prevents submitting without selecting a user
            >                    

              {/*Default placeholder option */}
              <option value="">Select User</option>

              {/*
               * Loop through users array (fetched from database)
               * and create a dropdown option for each user
               */}
              {users.map((u) => (
                <option
                 key={u.UserID}            //unique key for react rendering
                 value={u.UserID}          //this gets sent to the backend (Foreign key)
                 >        

                  {/*What the user sees in dropdown */} 
                  {u.FirstName} {u.LastName}
                </option>
              ))}

            </select>

            {/**
             * If there is a validation error for userID
             * display it in red under the dropdown
             */}
            {errors.userID && <p style={{ color: "red" }}>{errors.userID}</p>}
          </div>

          {/*Appliance Type (dropdown) */}
          <div>
            <label>Appliance</label>
            <select name="applianceType" value={form.applianceType} onChange={handleChange} required>
              <option value="">Select appliance</option>
              <option value="fridge">Fridge</option>
              <option value="cooker">Cooker</option>
              <option value="microwave">Microwave</option>
              <option value="dishwasher">Dishwasher</option>
              <option value="washing_machine">Washing Machine</option>
            </select>
            {errors.applianceType && <p style={{ color: "red" }}>{errors.applianceType}</p>}
          </div>

          {/*Brand */}
          <div>
            <label>Brand</label>
            <input name="brand" value={form.brand} onChange={handleChange} required />
            {errors.brand && <p style={{ color: "red" }}>{errors.brand}</p>}
          </div>

          {/*Model Number */}
          <div>
            <label>Model Number</label>
            <input name="modelNumber" value={form.modelNumber} onChange={handleChange} required />
            {errors.modelNumber && <p style={{ color: "red" }}>{errors.modelNumber}</p>}
          </div>

          {/*Serial Date */}
          <div>
            <label>Serial Number</label>
            <input name="serialNumber" value={form.serialNumber} onChange={handleChange} required />
            {errors.serialNumber && <p style={{ color: "red" }}>{errors.serialNumber}</p>}
          </div>

          {/*Purchase Date */}
          <div>
            <label>Purchase Date</label>
            <input type="date" name="purchaseDate" value={form.purchaseDate} onChange={handleChange} required />
            {errors.purchaseDate && <p style={{ color: "red" }}>{errors.purchaseDate}</p>}
          </div>

          {/*Warranty Date */}
          <div>
            <label>Warranty Expiration Date</label>
            <input type="date" name="warrantyDate" value={form.warrantyDate} onChange={handleChange} required />
            {errors.warrantyDate && <p style={{ color: "red" }}>{errors.warrantyDate}</p>}
          </div>

          {/*Cost */}
          <div>
            <label>Cost of Appliance</label>
            <input type="number" step="0.01" name="cost" value={form.cost} onChange={handleChange} required />
            {errors.cost && <p style={{ color: "red" }}>{errors.cost}</p>}
          </div>

          {/*Add to Inventory Button */}
          <button type="submit">Add to Inventory</button>
          {applianceMessage && <p>{applianceMessage}</p>}
        </form>
      </div>

      {/*Navigation back to HomePage */}
      <a href="/">Back to Homepage</a>
    </div>
  );
}