import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import {decodeToken} from "react-jwt";

function HomePage() {
    const [userId, setUserId] = useState(null);
  
   
    useEffect(() => {
        getUser();
      }, []);
    
    async function getUser(): Promise<void> {
        const response = await fetch(`http://localhost:5050/decode/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: localStorage.getItem("token")
            })
        });
    
        const result = await response.json();
        setUserId(result.userId);
      
   }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <section className="relative bg-gray-200">
        <img
          src="/images/OCBC_1.png"
          alt="Welcome Background"
          className="w-full h-full object-cover"
        />
      </section>

       <div className="relative max-w-7xl mx-auto -mt-24 p-8 bg-white shadow-lg rounded-lg">
        <div className="flex justify-around text-left space-x-4">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">Banking for individuals</h2>
            <ul className="space-y-2 text-blue-600 text-lg">
              <li><a href="#frank" className="hover:underline">FRANK by OCBC</a></li>
              <li><a href="#personal" className="hover:underline">Personal Banking</a></li>
              <li><a href="#premier" className="hover:underline">Premier Banking</a></li>
              <li><a href="#private" className="hover:underline">Premier Private Client</a></li>
            </ul>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">Banking for businesses</h2>
            <ul className="space-y-2 text-blue-600 text-lg">
              <li><a href="#business" className="hover:underline">Business Banking</a></li>
              <li><a href="#corporates" className="hover:underline">Large Corporates</a></li>
            </ul>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">OCBC Group</h2>
            <ul className="space-y-2 text-blue-600 text-lg">
              <li><a href="#about" className="hover:underline">About us</a></li>
              <li><a href="#sustainability" className="hover:underline">Sustainability</a></li>
              <li><a href="#careers" className="hover:underline">Careers</a></li>
              <li><a href="#investors" className="hover:underline">Investors</a></li>
            </ul>
          </div>
        </div>
      </div>

      <section className="max-w mx-auto my-16 p-12 bg-white shadow-lg rounded-lg">
        <div className="text-2xl font-semibold text-red-500 mb-4">HIGHLIGHTS</div>
        <div className="flex flex-col md:flex-row items-center mt-6">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h3 className="text-3xl font-semibold text-gray-800 mb-4">
              ASEAN and Greater China. A land of aspirations.
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              As one Group, we enable your ambitions across borders.
            </p>
            <button className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 text-lg">
              Find out more
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/OCBC_2.png"
              alt="Highlights"
              className="rounded-md shadow-md max-w-full h-auto"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;