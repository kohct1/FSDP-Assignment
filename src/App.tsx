import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Login from "./Login";
import Enquiry from './ActiveEnquiriesStaff';
import BookingDate from "./BookingDate";
import BookingPage from './BookingPage';
import OCBCsignup from './OCBCsignup';
import HomePage from './HomePage';
import BookingTime from "./BookingTime";
import Ticketing from "./Ticketing";
import Queue from "./Queue";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="enquiries" element={<Enquiry />} />
      <Route path="booking-date" element={<BookingDate />} />
      <Route path="bookingpage" element={<BookingPage />} />
      <Route path="signup" element={<OCBCsignup />} />
      <Route path="homepage" element={<HomePage />} />
      <Route path="booking-time" element={<BookingTime />} />
      <Route path="ticketing" element={<Ticketing />} />
      <Route path="queue" element={<Queue />} />
    </Routes>
  );
}

export default App;
