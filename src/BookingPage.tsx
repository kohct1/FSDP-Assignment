import React, { useState } from 'react';

const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    salutation: '',
    name: '',
    phoneNumber: '',
    email: '',
    reason: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic
    console.log(formData);
  };

  return (
    <div className="bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <img src="/images/OCBC-Bank-Logo.png" alt="OCBC Logo" className="h-16" />
        <div className="space-x-8">
          <a href="#" className="text-gray-600 hover:text-gray-800">Booking</a>
          <a href="#" className="text-gray-600 hover:text-gray-800">Queue</a>
          <a href="#" className="text-gray-600 hover:text-gray-800">Enquiry Portal</a>
        </div>
      </nav>

      {/* Form Section */}
      <div className="flex justify-center items-center py-12">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8">
          {/* Title and Phone */}
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Make a Booking</h1>
          <p className="text-gray-600 text-sm mb-8">
            For urgent matters, please call us directly at <span className="font-semibold">6535 7677</span>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {/* Salutation */}
              <div>
                <label className="block text-left text-gray-700 text-sm mb-2">Salutation:</label>
                <select
                  name="salutation"
                  value={formData.salutation}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select</option>
                  <option value="Mr">Mr</option>
                  <option value="Ms">Ms</option>
                  <option value="Mrs">Mrs</option>
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-left text-gray-700 text-sm mb-2">
                  Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter your name"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-left text-gray-700 text-sm mb-2">
                  Phone Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="block w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-left text-gray-700 text-sm mb-2">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter your email"
                />
              </div>

              {/* Reason for Booking */}
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

              {/* Continue Button */}
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
