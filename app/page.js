"use client";
import Link from "next/link"; 

export default function Home() {
  return (
     <div className="text-gray-900 font-medium p-6 max-w-2xl mx-auto space-y-6">

     <div className= "text-centre, mt-12" >  
      <h1 className="text-3xl font-bold mb-6">Welcome to My Assignment</h1>
      <p className = "mb-6">Appliance Management System:</p>

      <div className = "flex flex-col gap-4 items-center">
        <Link 
            href="/part-b-c/add"
            className ="px-6 py-3 bg-blue-600 text-white rounded-xl hover: bg-blue-700">
            Add Appliance
        </Link>

        <Link 
            href="/part-b-c/search"
            className ="px-6 py-3 bg-green-600 text-white rounded-xl hover: bg-green-700">
            Search Appliance
        </Link>

        <Link
             href="/part-b-c/update"
             className ="px-6 py-3 bg-yellow-600 text-white rounded-xl hover: bg-yellow-700">
            Update Appliance
        </Link>

        <Link
             href="/part-b-c/delete"
             className ="px-6 py-3 bg-red-600 text-white rounded-xl hover: bg-red-700">
            Delete Appliance
        </Link>
      </div>
    </div>
    </div>
  );
}