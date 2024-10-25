import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Login from "./Login";
import Booking from './Booking';
import BookingDate from "./BookingDate";
import BookingPage from './BookingPage';
import OCBCsignup from './OCBCsignup';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="booking" element={<Booking />} />
      <Route path="booking-date" element={<BookingDate />} />
      <Route path="bookingpage" element={<BookingPage />} />
      <Route path="signup" element={<OCBCsignup />} />
    </Routes>
  );
}

export default App
