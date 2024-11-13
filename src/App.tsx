import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Login from "./Login";
import Enquiry from './ActiveEnquiriesStaff';
import BookingDate from "./BookingDate";
import BookingPage from './BookingPage';
import OCBCsignup from './OCBCsignup';
import HomePage from './HomePage';
import Ticketing from "./Ticketing";
import Queue from "./Queue";
import MakeEnquiry from "./MakeEnquiry";
import CustomerEnquiries from "./ActiveEnquiriesCustomer";
import EnquiriesResponse from "./EnquiriesResponse";
import CallPage from "./CallPage";
import WebCall from "./WebCall";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="staff/enquiries" element={<Enquiry />} />
      <Route path="booking-date" element={<BookingDate />} />
      <Route path="bookingpage" element={<BookingPage />} />
      <Route path="signup" element={<OCBCsignup />} />
      <Route path="homepage" element={<HomePage />} />
      <Route path="ticketing" element={<Ticketing />} />
      <Route path="queue" element={<Queue />} />
      <Route path="user/enquiries/make" element={<MakeEnquiry />} />
      <Route path="user/enquiries/view" element={<CustomerEnquiries/>} />
      <Route path="user/enquiries/response" element={<EnquiriesResponse />} />
      <Route path="callpage" element={<CallPage />} />
      <Route path="webcall" element={<WebCall />} />
    </Routes>
  );
}

export default App;
