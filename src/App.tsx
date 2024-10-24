import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Login from "./Login";
import Booking from './Booking';
import BookingDate from "./BookingDate";
import OCBCsignup from './OCBCsignup.tsx'
import BookingPage from './BookingPage.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="booking" element={<Booking />} />
      <Route path="booking-date" element={<BookingDate />} />
    </Routes>
  );
}

export default App
