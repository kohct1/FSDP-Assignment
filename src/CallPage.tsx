import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./components/Navbar";

const CallPage: React.FC = () => {
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isCallingEnabled, setIsCallingEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(5);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getUser();
}, []);

async function getUser() {
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
    console.log("User ID:", result.userId); 
}

  async function fetchBookingDetails(): Promise<void> {
      const response = await fetch(`http://localhost:5050/userBookings/${userId}/`);
      const result = await response.json();
      setBookingDetails(result);
      console.log(result);
      setLoading(false);
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [userId]);

  useEffect(() => {
    // if (bookingDetails) {
    //   const countdownInterval = setInterval(() => {
    //     setCountdown((prev) => {
    //       if (prev === 1) {
    //         if (bookingDetails.queue === 0) {
    //           navigate('/webcall');
    //         } else {
    //           navigate('/bookingpage');
    //         }
    //         clearInterval(countdownInterval);
    //         return 0;
    //       }
    //       return prev - 1;
    //     });
    //   }, 1000);

    //   return () => clearInterval(countdownInterval); 
    // }
  }, [bookingDetails, navigate]);

  const handleCall = () => {
    alert(`Calling staff for your booking: ${bookingDetails.reason}`);
    navigate('/homepage');
  };

  const formatBookingTime = () => {
    if (!bookingDetails || !bookingDetails.slot || bookingDetails.slot.length < 2) {
      return "Invalid booking time";  
    }
  
    let { time: time1 } = bookingDetails;
    let time2 = time1;
    let slot1 = String((bookingDetails.slot[0] - 1) * 10);
    let slot2 = String(bookingDetails.slot[1] * 10);
  
    if (slot1 === "0" || slot1 === "60") slot1 = "00";
    if (slot2 === "0" || slot2 === "60") {
      slot2 = "00";
      time2 = time2 === 12 ? 1 : time2 + 1;
    }
  
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[new Date().getMonth()]} ${bookingDetails.date}, ${time1}.${slot1} - ${time2}.${slot2}`;
  };
  

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading booking details...</div>;
  }

  return (
    <div className="bg-gray-100">
      <Navbar />
      <div className="flex justify-center items-center py-12">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Your Booking Details</h1>
          <p className="text-gray-600 text-sm mb-4">Reason for Booking: {bookingDetails.reason}</p>
          <p className="text-gray-600 text-sm mb-4">Date & Time: {formatBookingTime()}</p>

          {bookingDetails.queue === 0 ? (
            <p className="mt-6 text-green-500">Thank you for waiting! A customer service representative will be connected with you shortly!</p>
          ) : isCallingEnabled ? (
            <button
              onClick={handleCall}
              className="mt-6 w-full flex justify-center items-center bg-red-500 text-white py-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Call Staff
            </button>
          ) : (
            <p className="mt-6 text-red-500">You cannot call staff yet. Please wait for your turn or the scheduled time.</p>
          )}

          <p className="mt-4 text-blue-500">
            Redirecting in {countdown} second{countdown > 1 ? 's' : ''}...
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallPage;
