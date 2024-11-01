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
    await fetch(`http://localhost:5050/bookings/`, {
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
            <div className="w-full h-full flex flex-col justify-center items-center">
                <div className="w-1/2 h-1/2 flex flex-col justify-center items-center bg-slate-100 border-2 rounded-md p-8 gap-8">
                    <div className="w-full flex flex-col gap-4">
                        <h1 className="w-full text-4xl text-start font-semibold">Booking description</h1>
                        <h1 className="w-full text-xl text-start">Edit your booking description</h1>
                    </div>
                    <textarea className="w-full h-3/4 resize-none p-4" value={newReason} onChange={(e) => setNewReason(e.target.value)}></textarea>
                    <div className="w-full flex justify-end gap-8">
                        <button onClick={deleteBooking}>Change booking</button>
                        <button className="bg-red-600 text-white rounded px-4 py-2" onClick={editBooking}>Edit</button>
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
