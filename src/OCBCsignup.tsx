import React, { useState } from "react";

const SustainableMe: React.FC = () => {
  // Example state to handle form data (you can expand this as per your requirements)
  const [formData, setFormData] = useState({
    cardNumber: "",
    pin: "",
    identificationType: "Please Select",
    identificationNumber: "",
    day: "Day",
    month: "Month",
    year: "Year",
    captchaInput: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Handle the form submission logic here
    console.log(formData);
  };

  return (
    <div className="bg-white">
      {/* Logo */}
      <div className="text-center mb-6">
        <img src="/images/OCBC-Bank-Logo.png" alt="OCBC Logo" className="mx-auto h-28" />
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto bg-white p-10 pt-0 shadow-md flex-grow">
        
        {/* ATM/Credit/Debit Card Details Section */}
        <div className="relative -mx-10">
          <h2 className="text-lg text-left pl-10 font-semibold bg-red-600 text-white p-2 mb-4">1. Your ATM/credit/debit card details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-left text-sm font-medium text-gray-700">Last 8-digits of card no.</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-left text-sm font-medium text-gray-700">6-digit PIN:</label>
            <input
              type="password"
              name="pin"
              value={formData.pin}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="relative -mx-10">
          <h2 className="text-lg pl-10 text-left font-semibold bg-red-600 text-white p-2 mb-4">2. Personal details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-left text-sm font-medium text-gray-700">Identification type:</label>
            <select
              name="identificationType"
              value={formData.identificationType}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            >
              <option>Please Select</option>
              <option>NRIC</option>
              <option>Passport</option>
              <option>FIN</option>
            </select>
          </div>
          <div>
            <label className="block text-left text-sm font-medium text-gray-700">Identification no.:</label>
            <input
              type="text"
              name="identificationNumber"
              value={formData.identificationNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-left text-sm font-medium text-gray-700">Day</label>
            <select
              name="day"
              value={formData.day}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            >
              <option>Day</option>
              {/* Add day options here */}
            </select>
          </div>
          <div>
            <label className="block text-left text-sm font-medium text-gray-700">Month</label>
            <select
              name="month"
              value={formData.month}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            >
              <option>Month</option>
              {/* Add month options here */}
            </select>
          </div>
          <div>
            <label className="block text-left text-sm font-medium text-gray-700">Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            >
              <option>Year</option>
              {/* Add year options here */}
            </select>
          </div>
        </div>

        {/* Extra Security Check Section */}
        <div className="relative -mx-10"> {/* Wrapper div with negative margin */}
          <h2 className="text-left pl-10 text-lg font-semibold bg-red-600 text-white p-2 mb-4">
            3. Extra security check
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
          <div className="flex flex-col">
            <label className="block text-left text-sm font-medium text-gray-700">Generated Captcha</label>
            <img src="captcha-image.png" alt="Captcha" className="mt-2" />
            <a href="#" className="text-sm text-blue-600 hover:underline mt-1 text-left">Get another code</a>
          </div>
          <div>
            <input
              type="text"
              name="captchaInput"
              value={formData.captchaInput}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Enter the characters as seen"
            />
          </div>
        </div>


        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-red-600 text-white py-3 px-16 rounded-md shadow-md hover:bg-red-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SustainableMe;
