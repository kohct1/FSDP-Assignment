import React, { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";

const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    salutation: '',
    name: '',
    phoneNumber: '',
    email: '',
    reason: '',
  });

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
                <label className="block text-left text-gray-700 text-sm mb-2">Salutation:</label>
                <input
                  type="text"
                  name="salutation"
                  value={formData.salutation}
                  readOnly
                  className="block w-full border border-gray-300 rounded p-2 bg-gray-200 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-left text-gray-700 text-sm mb-2">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  readOnly
                  className="block w-full border border-gray-300 rounded p-2 bg-gray-200 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-left text-gray-700 text-sm mb-2">Phone Number:</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  readOnly
                  className="block w-full border border-gray-300 rounded p-2 bg-gray-200 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-left text-gray-700 text-sm mb-2">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="block w-full border border-gray-300 rounded p-2 bg-gray-200 cursor-not-allowed"
                />
              </div>

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
                <button
                  type="submit"
                  className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Continue
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
