import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Login from "./Login";
import Booking from './Booking';
import Ticketing from './Ticketing';
import Queue from './Queue';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="booking" element={<Booking />} />
      <Route path="ticketing" element={<Ticketing />} />
      <Route path="queue" element={<Queue />} />
    </Routes>
  );
}

export default App;
