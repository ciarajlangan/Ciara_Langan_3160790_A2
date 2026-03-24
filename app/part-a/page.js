"use client"; 
import {useState} from "react";

export default function PartA() {
    const [movie, setMovie] = useState("");
    const [showtime, setShowTime] = useState("");
    const [mobile, setMobile] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!movie || !showtime || !mobile) {
            setMessage("Please fill in all fields.");
            return;
        }

        //mobile validation 
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(mobile)) {
            setMessage("Please enter a valid 10-digit mobile number.");
            return;
        }

        //sucess message
        setMessage(
            'Your booking for ${movie} at ${showtime} has been confirmed. A confirmation test has been sent to ${mobile}'
        );

    };

    return (
        <div>
            <h1>Cinema Ticket Booking</h1>

            <form onSubmit ={handleSubmit}>
            <label>Movie:</label>
            <select value = {movie} onChange={(e) => setMovie(e.target.value)}>
                <option value = "">Select a movie</option>
                <option value = "The Devil Wears Prada 2">The Devil Wears Prade 2</option>
                <option value = "The Super Mario Galaxy Movie">Super Mario</option>
                <option value = "Hamnet">Hamnet</option>
                <option value = "Wuthering Heights">Wuthering Heights</option>
            </select>

            <br></br>

            <label>Showtime:</label>
            <select value = {showtime} onChange={(e) => setShowTime(e.target.value)}>
                <option value = "">Select a time</option>
                <option value = "15:00">3PM</option>
                <option value = "16:00">4PM</option>
                <option value = "19:00">7PM</option>
                <option value = "21:00">9PM</option>
            </select>

            <br></br>

            <label>Mobile:</label>
            <input
              type = "text"
              value = {mobile}
              onChange = {(e) => setMobile(e.target.value)}
              placeholder = "Enter Mobile Number"
            />

            <br></br>

            <button type = "submit">Book Tickets</button>
        </form>

         <p>{message}</p>
        </div>
    );
}