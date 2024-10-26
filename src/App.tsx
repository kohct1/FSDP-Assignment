import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Login from "./Login";
import Booking from './Booking';
import Enquiry from './ActiveEnquiriesStaff';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="booking" element={<Booking />} />
      <Route path="enquiries" element={<Enquiry />} />
    </Routes>
  );
}

export default App
