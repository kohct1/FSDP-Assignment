import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Login from "./Login";
import Booking from './Booking';
import BookingDate from "./BookingDate";
import BookingTime from "./BookingTime";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="booking" element={<Booking />} />
      <Route path="booking-date" element={<BookingDate />} />
      <Route path="booking-time" element={<BookingTime />} />
    </Routes>
  );
}

export default App
