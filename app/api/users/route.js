import db from "@/app/lib/db";

//GET all users------------------------------------------
export async function GET() {
  try {

    //Run SQL query to fetch all users from the Users table
    //db.query returns [rows, fields]-> we only need rows
    const [users] = await db.query("SELECT * FROM Users");

    //Return users as a JSON response with HTTP 200 Success message
    return Response.json({ users }, { status: 200 });

  } catch (error) {

    //Log error in server console (for debugging)
    console.log("GET users error:", error);

    //Send error response back to frontend
    return Response.json(
      { message: "Failed to fetch users" },
      { status: 500 } //server error 
    );
  }
}

//ADD user-------------------------------
export async function POST(request) {
  try {

    //Get JSON data sent from frontend form
    const data = await request.json();

    //Destructure fields from request body
    const {
      firstName,
      lastName,
      address,
      mobile,
      email,
      eircode,
    } = data;

    //Check if user exists----------------
    //prevents dupliacte users (based on email)
    const [existingUser] = await db.query(
      "SELECT * FROM Users WHERE Email = ?",
      [email] //parameterized query (prevents SQL injection)
    );

    //If user already exists, return error
    if (existingUser.length > 0) {
      return Response.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    //Insert new user---------------------------------------
    const [result] = await db.query(
      `INSERT INTO Users
      (FirstName, LastName, Address, Mobile, Email, Eircode)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, address, mobile, email, eircode]
    );

    //Create user object to send back to frontend 
    const newUser = {
      UserID: result.insertId,   //auto-generated primary key
      FirstName: firstName,
      LastName: lastName,
      Address: address,
      Mobile: mobile,
      Email: email,
      Eircode: eircode,
    };

    //Return success response with created user
    return Response.json(
      {
        message: "User added successfully",
        user: newUser,
      },
      { status: 201 } //created
    );

  } catch (error) {

    //log error for debugging
    console.log("POST user error:", error);

    //Return generic error message to frontend
    return Response.json(
      { message: "Failed to add user" },
      { status: 500 }
    );
  }
}