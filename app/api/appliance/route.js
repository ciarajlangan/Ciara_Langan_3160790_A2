// app/api/appliance/route.js
//Import database connection--------------------------------------------------------------------------------------
import db from "@/app/lib/db";

//SEARCH APPLIANCE (Read)-----------------------------------------------------------------------------------------
export async function GET(request) {
  try {
    //extract query parameter from URL (?serialNumber=...)
    const { searchParams } = new URL(request.url);
    const serialNumber = searchParams.get("serialNumber");

    //Query database:---------------------------------------------------------------------------------------------
    //Join appliance + users table using UserID (foreign key)
    //This gives both appliance + user details in one result
    const [rows] = await db.query(
      `SELECT appliance.*, users.FirstName, users.LastName, users.Address, users.Mobile, users.Email, users.Eircode
       FROM appliance
       JOIN users ON appliance.UserID = users.UserID
       WHERE appliance.SerialNumber = ?`,
      [serialNumber] //parameterised query (prevents SQL injection)
    );

    //If no results found---------------------------------------
    if (rows.length === 0) {
      return Response.json(
        { message: "No matching appliance found!" },
        { status: 404 }
      );
    }

    //Return first matching appliance
    return Response.json({ appliance: rows[0] }, { status: 200 });

    //catch error and give generic error response 
  } catch (error) {
    console.log("GET appliance error:", error);
    return Response.json({ message: "Search failed" }, { status: 500 });
  }
}


//ADD APPLIANCE (Create)-------------------------------------------------------------------------------------------
export async function POST(request) {
  try {
    //Get JSON data send from the frontend---------
    const data = await request.json();

    //Extract fields from request------------------
    const userID = data.userID;
    const applianceType = data.applianceType.trim();
    const brand = data.brand.trim();
    const modelNumber = data.modelNumber.trim();
    const serialNumber = data.serialNumber.trim();
    const purchaseDate = data.purchaseDate;
    const warrantyDate = data.warrantyDate;
    const cost = data.cost;

    //Check if appliance already exists (based on unique serial number)
    const [existingAppliance] = await db.query(
      "SELECT * FROM appliance WHERE SerialNumber = ?",
      [serialNumber]
    );

    //returns message that it already existed based on matching serial number
    if (existingAppliance.length > 0) {
      return Response.json(
        { message: "Appliance already exists" },
        { status: 400 }
      );
    }

    //Insert new appliance into database--------------------------------------------------------------
    await db.query(
      `INSERT INTO appliance
      (UserID, ApplianceType, Brand, ModelNumber, SerialNumber, PurchaseDate, WarrantyExpiration, Cost)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userID,
        applianceType,
        brand,
        modelNumber,
        serialNumber,
        purchaseDate,
        warrantyDate,
        cost,
      ]
    );

    //success message--------------------------------
    return Response.json(
      { message: "New appliance added successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.log("POST appliance error:", error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}


//UPDATE APPLIANCE(Update)-------------------------------------
export async function PUT(request) {
  try {
    const data = await request.json();

    //Handle frontend naming styles----------------------------
    const serialNumber = data.SerialNumber;
    const applianceType = data.ApplianceType;
    const brand = data.Brand;
    const modelNumber = data.ModelNumber;

    //covert MYSQL/JS date back to yyyy-mm-dd for MYSQL Date column
    const warrantyDate = data.WarrantyExpiration
     ? data.WarrantyExpiration.split("T")[0]
     : null;
     
    const cost = data.Cost;

    //User fields (linked table)----------------------
    const firstName = data.FirstName;
    const lastName = data.LastName;
    const address = data.Address;
    const mobile = data.Mobile;
    const email = data.Email;
    const eircode = data.Eircode;
    const userID = data.UserID;

    //Update appliance table
    const [applianceResult] = await db.query(
      `UPDATE appliance
       SET ApplianceType = ?, Brand = ?, ModelNumber = ?, WarrantyExpiration = ?, Cost = ?
       WHERE SerialNumber = ?`,
      [applianceType, brand, modelNumber, warrantyDate, cost, serialNumber]
    );

    //If no rows updated -> appliance not found----
    if (applianceResult.affectedRows === 0) {
      return Response.json(
        { message: "No matching appliance found!" },
        { status: 404 }
      );
    }

    //Update related user record-------------------------------------------------------
    await db.query(
      `UPDATE users
       SET FirstName = ?, LastName = ?, Address = ?, Mobile = ?, Email = ?, Eircode = ?
       WHERE UserID = ?`,
      [firstName, lastName, address, mobile, email, eircode, userID]
    );

    return Response.json(
      { message: "Appliance has been updated" },
      { status: 200 }
    );

  } catch (error) {
    console.log("PUT appliance error:", error);

    return Response.json({ message: "Update failed" }, { status: 500 });
  }
}


//DELETE APPLIANCE (Delete)------------------------------------
export async function DELETE(request) {
  try {
    const data = await request.json();

    //Get serial number from request---------------------------
    const serialNumber = data.serialNumber || data.SerialNumber;

    //Delete appliance using serial number----------
    const [result] = await db.query(
      "DELETE FROM appliance WHERE SerialNumber = ?",
      [serialNumber]
    );

    //If nothing deleted -> appliance not found----
    if (result.affectedRows === 0) {
      return Response.json(
        { message: "No matching appliance found!" },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Appliance Deleted" },
      { status: 200 }
    );

  } catch (error) {
    console.log("DELETE appliance error:", error);
    return Response.json({ message: "Delete failed" }, { status: 500 });
  }
}