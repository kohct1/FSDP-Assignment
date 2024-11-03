import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./components/Navbar";

const CallPage: React.FC = () => {
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isCallingEnabled, setIsCallingEnabled] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Fake booking details for testing
  const fakeBookingDetails = {
    reason: 'Consultation regarding your account',
    dateTime: new Date(new Date().getTime() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
    queue: 1 // Change this to 1 or more to test the waiting message
  };

  const fetchBookingDetails = async () => {
    // Simulating API response with fake data
    setTimeout(() => {
      setBookingDetails(fakeBookingDetails);
      checkIfBookingReady(fakeBookingDetails);
      setLoading(false);
    }, 1000); // Simulate a delay of 1 second
  };

  const checkIfBookingReady = (details: any) => {
    if (details.queue === 0) {
      setIsCallingEnabled(true);
    } else {
      const bookingTime = new Date(details.dateTime);
      if (bookingTime <= currentTime) {
        setIsCallingEnabled(true);
      }
    }
  };

  useEffect(() => {
    fetchBookingDetails();

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleCall = () => {
    alert(`Calling staff for your booking: ${bookingDetails.reason}`);
    navigate('/homepage');
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
          <p className="text-gray-600 text-sm mb-4">Date & Time: {new Date(bookingDetails.dateTime).toLocaleString()}</p>

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
        </div>
      </div>
    </div>
  );
};

export default CallPage;
