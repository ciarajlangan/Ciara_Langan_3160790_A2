"use client";
import Link from "next/link"; 

export default function Home() {
  return (
     <div className="text-gray-900 font-medium p-6 max-w-2xl mx-auto space-y-6">
     <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 className="text-3xl font-bold mb-6">Welcome to My Assignment</h1>
      <p>Select a section to continue:</p>

      <div style={{ marginTop: "30px" }}>
        <Link href="/part-a">
          <button style={{ margin: "10px", padding: "10px 20px" }}>
            Cinema Booking (Part A)
          </button>
        </Link>

        <Link href="/part-b-c">
          <button style={{ margin: "10px", padding: "10px 20px" }}>
            Appliance Inventory (Part B & C)
          </button>
        </Link>
      </div>
    </div>
    </div>
  );
}