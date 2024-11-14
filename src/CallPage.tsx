import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./components/Navbar";

const CallPage: React.FC = () => {
  const [bookingDetails, setBookingDetails] = useState<any>({});
  const [isCallingEnabled, setIsCallingEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(5);
  const [formattedBookingTime, setFormattedBookingTime] = useState<string>("");
  const [missedTimeSlot, setMissedTimeSlot] = useState<boolean>(false); 
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

  useEffect(() => {
    if (userId) {
      fetchBookingDetails();
    }
  }, [userId]);

  async function fetchBookingDetails(): Promise<void> {
    const response = await fetch(`http://localhost:5050/userBookings/${userId}/`);
    const result = await response.json();
    setBookingDetails(result);
    setLoading(false);
  }

  useEffect(() => {
    if (bookingDetails && bookingDetails.bookings) {
      const formattedTime = formatBookingTime(bookingDetails);
      setFormattedBookingTime(formattedTime);
      checkBookingTimeStatus();
    }
  }, [bookingDetails]);

  const checkBookingTimeStatus = () => {
    const booking = bookingDetails.bookings[0];
    const { time, slot } = booking;
  
    let bookingDateTime = new Date();
    let adjustedHour = time;
  
    if (time <= 10 || time === 12) {
      adjustedHour = time + 12; 
    }
  
    const startMinutes = (slot[0] - 1) * 10;  
    const endMinutes = slot[0] * 10;          
  
    bookingDateTime.setHours(adjustedHour);
    bookingDateTime.setMinutes(startMinutes); 
    bookingDateTime.setSeconds(0);
  
    const now = new Date();
    const diffInMinutes = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60);
  
    // log for testing
    // console.log(`Booking DateTime: ${bookingDateTime}`);
    // console.log(`Current DateTime: ${now}`);
    // console.log(`Time Difference (in minutes): ${diffInMinutes}`);
  
    if (diffInMinutes <= 10 && diffInMinutes >= 0) {
      setIsCallingEnabled(true);
      setMissedTimeSlot(false);
    } else if (diffInMinutes < 0 && Math.abs(diffInMinutes) <= 10) {
      setIsCallingEnabled(false);
      setMissedTimeSlot(true);
    } else {
      setIsCallingEnabled(false);
      setMissedTimeSlot(false);
    }
  };

  useEffect(() => {
    if (bookingDetails) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);

            if (missedTimeSlot) {
              alert("You missed your time slot. Redirecting to the booking page.");
              navigate('/bookingpage');
            } else if (isCallingEnabled) {
              navigate('/webcall');
            } else {
              navigate('/bookingpage');
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [bookingDetails, isCallingEnabled, missedTimeSlot, navigate]);

  const formatBookingTime = (bookingDetails) => {
    if (!bookingDetails || !bookingDetails.bookings || bookingDetails.bookings.length === 0) {
      return "Invalid booking time";
    }

    const booking = bookingDetails.bookings[0];
    const { time, slot, date } = booking;

    if (!slot || slot.length < 2) {
      return "Invalid booking time";
    }

    let time1 = time;
    let time2 = time;
    let slot1 = String((slot[0] - 1) * 10);
    let slot2 = String(slot[1] * 10);

    if (slot1 === "0" || slot1 === "60") slot1 = "00";
    if (slot2 === "0" || slot2 === "60") {
      slot2 = "00";
      time2 = time2 === 12 ? 1 : time2 + 1;
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[new Date().getMonth()]} ${date}, ${time1}:${slot1} - ${time2}:${slot2}`;
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
          <p className="text-gray-600 text-sm mb-4">Reason for Booking: {bookingDetails.bookings[0].reason}</p>
          <p className="text-gray-600 text-sm mb-4">Date & Time: {formattedBookingTime}</p>

          {missedTimeSlot ? (
            <p className="mt-6 text-red-500">You have missed your time slot. Redirecting to the booking page in {countdown} second{countdown > 1 ? 's' : ''}...</p>
          ) : bookingDetails.queue === 0 ? (
            <p className="mt-6 text-green-500">Thank you for waiting! A customer service representative will be connected with you shortly! Redirecting in {countdown} second{countdown > 1 ? 's' : ''}...</p>
          ) : isCallingEnabled ? (
            <p className="mt-6 text-blue-500">You can now enter the call. Redirecting in {countdown} second{countdown > 1 ? 's' : ''}...</p>
          ) : (
            <p className="mt-6 text-red-500">You cannot call staff yet. Please wait for your turn or the scheduled time. Redirecting in {countdown} second{countdown > 1 ? 's' : ''}...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallPage;
