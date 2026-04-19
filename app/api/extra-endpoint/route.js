// app/api/extra-endpoint/route.js

//import readFile so #it reads JSON file
import { readFile } from "fs/promises";

// GET request handler
export async function GET() {

  try {
    //create the file path to data.json 
    const filePath = process.cwd() + "/data.json";

    //read the contents of the file as text (utf-8 encoding)
    const file = await readFile(filePath, "utf-8");

    //convert the JSON string into a JavaScript object (array of appliances)
    const appliances = JSON.parse(file);

    //return the appliances data back to the frontend as JSON
    return new Response(
      JSON.stringify({ appliances }), //send appliances as response
      {
        status: 200, // HTTP success status
        headers: { "Content-Type": "application/json" } //tells the browser it's JSON
      }
    );

  } catch (error) {
    // If the file does not exist or cannot be read:
    // return an empty array instead of crashing the app

    return new Response(
      JSON.stringify({ appliances: [] }), //return empty list
      {
        status: 200, //still return success so frontend can handle it
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}