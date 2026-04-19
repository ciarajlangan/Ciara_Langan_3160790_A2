//BACKEND LOGIC // app/api/register/route.js 
import {readFile, writeFile} from "fs/promises";

export async function POST(request) {
  
  try{
  const data = await request.json(); //get the JSON from frontend

  // Trim whitespace
  data.eircode = data.eircode.trim();   
  data.model = data.model.trim();
  data.serial = data.serial.trim()
  data.brand = data.brand.trim();
  data.appliance = data.appliance.trim(); 

  console.log("Incoming data:", data)
  console.log("Model number:", data.model.split(""));
  console.log("Testing model regex:", /^\d{3}-\d{3}-\d{4}$/.test("000-000-0000"));

  //validation for appliances
  const validAppliances = [
    "fridge",
    "cooker",
    "microwave",
    "dishwasher",
    "washing_machine"
  ];

  if (!validAppliances.includes(data.appliance)) {
    return new Response(
        JSON.stringify({ message: "Invalid appliance selected"}),
        { status: 400, headers: { "Content-Type": "application/json"}}
    );
  }

  //validation for eirocde
  const eircodePattern = /^[A-Z]\d{2}\s?\d{4}$/i; // example: D02 1234
    if (!eircodePattern.test(data.eircode)) {
     console.log("Eircode invalid:", data.eircode);
      return new Response(
        JSON.stringify({ message: "Invalid Eircode Format"}), {
        status: 400, 
        headers: { "Content-Type": "application/json" }}
    );
  }

  //validation for model number
  const modelPattern = /^\d{3}-\d{3}-\d{4}$/; // example 000-000-0000
     if (!modelPattern.test(data.model)) {
      console.log("Model Number invalid:", data.model);
       return new Response(
        JSON.stringify({ message: "Invalid Model Number"}), {
        status: 400,
        headers: { "Content-Type": "application/json"}
     });
  }

  //validation for serial number
  const serialPattern = /^\d{4}-\d{4}-\d{4}$/; //response to user; //example 0000-0000-0000
    if (!serialPattern.test(data.serial)) {
     console.log("Serial number invalid:", data.serial);
      return new Response(
       JSON.stringify({message: "Invalid Serial Number"}), {
        status: 400,
        headers: { "Content-Type": "application/json"}
    });
  }

  // Regex for YYYY-MM-DD (from <input type="date">)
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

// Purchase date validation
if (!datePattern.test(data.purchaseDate)) {
 console.log("Purchase date invalid:", data.purchaseDate);
  return new Response(
    JSON.stringify({ message: "Invalid Purchase Date" }),
    { status: 400, headers: { "Content-Type": "application/json" } }
  );
}

// Warranty date validation
if (!datePattern.test(data.warrantyDate)) {
 console.log("Warranty date invalid:", data.warrantyDate);
  return new Response(
    JSON.stringify({ message: "Invalid Warranty Date" }),
    { status: 400, headers: { "Content-Type": "application/json" } }
  );
}

 // Convert to DD/MM/YYYY
 const [pYear, pMonth, pDay] = data.purchaseDate.split("-");
 data.purchaseDate = `${pDay}/${pMonth}/${pYear}`;

 const [wYear, wMonth, wDay] = data.warrantyDate.split("-");
 data.warrantyDate = `${wDay}/${wMonth}/${wYear}`;

  //Read existing Data //save to JSON
  const filePath = process.cwd() + "/data.json";
  let existingData = [];

  try {
    const file = await readFile(filePath, "utf-8");
    existingData = JSON.parse(file);
  } catch (error) {
    existingData =[];
  }

  // Store formatted dates (DD/MM/YYYY)
  const formatDate = (d) => d.toISOString().split("T")[0].split("-").reverse().join("/");

  //adding new data
  existingData.push(data);

  //save back to file
  await writeFile(filePath, JSON.stringify(existingData, null, 2)); //null, 2 indentation 

  console.log("Received valid data:", data); 

    // Return success + the appliance details to display back
    return new Response(JSON.stringify({ success: true, appliance: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    // generic error without exposing sensitive details
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
