"use client"; // Enables client-side rendering
import { useState } from "react";

export default function PartA() {
  // States
  const [movie, setMovie] = useState("");
  const [showtime, setShowTime] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");

  // Movie - showtime mapping
  const movieTimes = {
    "The Devil Wears Prada 2": ["14:00", "18:00"],
    "The Super Mario Galaxy Movie": ["13:00", "17:00"],
    "Hamnet": ["13:00", "19:00"],
    "Wuthering Heights": ["18:00", "21:00"]
  };

  // Form submit handler
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!movie || !showtime || !mobile) {
      setMessage("Please fill in all fields.");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(mobile)) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setMessage(
      `Your booking for "${movie}" at ${showtime} has been confirmed. A confirmation text has been sent to ${mobile}.`
    );
  };

  return (
    <div className="text-gray-900 font-medium p-6 max-w-2xl mx-auto space-y-6">
      {/* Minimal styling: dark gray text, medium font, padding, max width, centered, spaced children */}
      <h1 className="text-2xl font-bold mb-4">Cinema Ticket Booking</h1>
      {/* Large bold heading, margin below */}

      <form onSubmit={handleSubmit}>
        <label>Movie:</label>
        <select value={movie} onChange={(event) => setMovie(event.target.value)}>
          <option value="">Select a movie</option>
          <option value="The Devil Wears Prada 2">The Devil Wears Prada 2</option>
          <option value="The Super Mario Galaxy Movie">The Super Mario Galaxy Movie</option>
          <option value="Hamnet">Hamnet</option>
          <option value="Wuthering Heights">Wuthering Heights</option>
        </select>

        <br />

        <label>Showtime:</label>
        <select value={showtime} onChange={(event) => setShowTime(event.target.value)}>
          <option value="">Select a time</option>
          {movie &&
            movieTimes[movie].map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
        </select>

        <br />

        <label>Mobile:</label>
        <input
          type="text"
          value={mobile}
          onChange={(event) => setMobile(event.target.value)}
          placeholder="Enter Mobile Number"
        />

        <br />

        <button type="submit">Book Tickets</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}