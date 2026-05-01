"use client";

import Link from "next/link";

export default function Home() {

  //Home page navigation options
  const options = [
    {
      title: "Add Appliance",
      description: "Register a new appliance and link it to a user",
      href: "/part-b-c/add",
    },
    {
      title: "Search Appliance",
      description: "Find appliance details using a serial number",
      href: "/part-b-c/search",
    },
    {
      title: "Update Appliance",
      description: "Edit appliance and user information",
      href: "/part-b-c/update",
    },
    {
      title: "Delete Appliance",
      description: "Remove an appliance record from the database",
      href: "/part-b-c/delete",
    },
  ];

  return (

    //Full page container
    <main className="min-h-screen bg-slate-100 text-gray-900 px-6 py-12">

      {/*Main content card */}
      <section className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        {/*Page heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">
            Welcome to My Assignment
          </h1>

          {/*Heading two */}
          <h2 className="text-2xl font-semibold text-blue-700">
            Household Appliance Inventory
          </h2>

          <p className="text-gray-600 mt-3">
            Choose an appliance management option below.
          </p>
        </div>

        {/*Navigation option cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              className="block border border-gray-300 rounded-xl p-5 bg-slate-50 hover:bg-blue-50 hover:border-blue-500 hover:shadow-md transition"
            >
              <span className="font-semibold">{option.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}