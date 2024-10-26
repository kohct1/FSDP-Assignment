import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Login from "./Login";
import Booking from './Booking';
import Enquiry from './ActiveEnquiriesStaff';
import BookingDate from "./BookingDate";
import BookingPage from './BookingPage';
import OCBCsignup from './OCBCsignup';
import HomePage from './HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="booking" element={<Booking />} />
      <Route path="enquiries" element={<Enquiry />} />
      <Route path="booking-date" element={<BookingDate />} />
      <Route path="bookingpage" element={<BookingPage />} />
      <Route path="signup" element={<OCBCsignup />} />
      <Route path="homepage" element={<HomePage />} />
    </Routes>
  );
}

export default App
