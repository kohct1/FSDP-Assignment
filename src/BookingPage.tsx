import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "./components/Navbar";

const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    salutation: '',
    name: '',
    phoneNumber: '',
    email: '',
    reason: '',
  });
  const [userId, setUserId] = useState<string>("");
  const [newReason, setNewReason] = useState<string>("");
  const [hasBookings, setHasBookings] = useState<boolean>(false);

  // Simulating fetching user data (replace with real data fetch)
  useEffect(() => {
    const fetchUserData = async () => {
      // Replace this object with an actual data fetch
      const userData = {
        salutation: 'Mr',
        name: 'John Doe',
        phoneNumber: '1234567890',
        email: 'johndoe@example.com',
      };
      
      setFormData({
        ...formData,
        ...userData,
      });
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (userId !== "") {
        getUserBookings();
    }
  }, [userId]);

  async function getUserBookings(): Promise<void> {
    const response = await fetch(`http://localhost:5050/userBookings/${userId}/`);
    const result = await response.json();

    if (result.bookings.length > 0) {
        setHasBookings(true);
        setNewReason(result.bookings[0].reason);
    }
  }

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

  async function deleteBooking(): Promise<void> {
    await fetch(`http://localhost:5050/bookings/${userId}/`, {
        method: "DELETE"
    });
  }

  async function editBooking(): Promise<void> {
    await fetch(`http://localhost:5050/bookingsReason/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: userId,
            reason: newReason
        })
    });
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  if (hasBookings) {
    return (
        <div className="w-full h-screen">
            <Navbar />
            <div className="w-full h-full flex flex-col items-center">
                <div className="w-1/2 h-1/2 flex flex-col items-center p-8 gap-8">
                    <div className="w-full border-b-2 py-8">
                        <h1 className="w-full text-2xl text-start font-semibold">Bookings</h1>
                    </div>
                    <div className="w-full flex flex-col justify-center border-2 rounded p-4 gap-4">
                      <h1 className="text-lg font-semibold">Wed, Nov 5 2025, 10:20 - 10:40</h1>
                      <div className="flex flex-col gap-2">
                        <h1 className="font-semibold">Booking description</h1>
                        <textarea className="w-full h-3/4 border-2 rounded resize-none p-2" value={newReason} onChange={(e) => setNewReason(e.target.value)}></textarea>
                      </div>
                      <div className="flex justify-end items-center gap-8">
                        <Link className="text-sm" to="/booking-date">Reschedule booking</Link>
                        <button className="bg-red-600 text-sm text-white rounded px-4 py-2" onClick={editBooking}>Edit</button>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-gray-100">
      <Navbar />

      <div className="flex justify-center items-center py-12">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Make a Booking</h1>
          <p className="text-gray-600 text-sm mb-8">
            For urgent matters, please call us directly at <span className="font-semibold">6535 7677</span>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-left text-gray-700 text-sm mb-2">
                  Reason for booking<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className="block w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter the reason for your booking"
                  maxLength={500}
                  rows={5}
                />
                <p className="text-sm text-left text-gray-500 mt-1">Characters left: {500 - formData.reason.length}</p>
              </div>

              <div className="mt-6">
                <Link
                  type="submit"
                  className="w-full flex justify-center items-center bg-red-500 text-white py-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  to="/booking-date"
                  state={{ reason: formData.reason }}
                >
                  Continue
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
