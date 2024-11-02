import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OCBCSignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardNumber: "",
    pin: "",
    identificationType: "",
    identificationNumber: "",
    day: "",
    month: "",
    year: "",
    captchaInput: "",
  });
  const [captcha, setCaptcha] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Generate a random captcha
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const captchaCode = Array.from({ length: 6 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join("");
    setCaptcha(captchaCode);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!/^\d{8}$/.test(formData.cardNumber)) {
      newErrors.cardNumber = "Card number must be 8 digits";
    }
    if (!/^\d{6}$/.test(formData.pin)) {
      newErrors.pin = "PIN must be 6 digits";
    }
    if (!formData.identificationType || formData.identificationType === "Please Select") {
      newErrors.identificationType = "Please select an identification type";
    }
    if (!formData.identificationNumber) {
      newErrors.identificationNumber = "Identification number is required";
    }
    if (!/^\d{4}$/.test(formData.year)) {
      newErrors.year = "Year must be 4 digits";
    }
    if (!formData.day || formData.day === "Day") {
      newErrors.day = "Please select a day";
    }
    if (!formData.month || formData.month === "Month") {
      newErrors.month = "Please select a month";
    }
    if (formData.captchaInput !== captcha) {
      newErrors.captchaInput = "Captcha does not match";
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  const handleSubmit = () => {
    validateForm();
    if (isFormValid) {
      navigate("/homepage");
    } else {
      alert("Please correct the errors before proceeding.");
    }
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  return (
    <div className="bg-white">
      <div className="text-center mb-6">
        <img src="/images/OCBC-Bank-Logo.png" alt="OCBC Logo" className="mx-auto h-28" />
      </div>
      <div className="max-w-6xl mx-auto bg-white p-10 pt-0 shadow-md flex-grow">
        {/* Card Details */}
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
            {errors.cardNumber && <p className="text-red-500 text-xs">{errors.cardNumber}</p>}
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
            {errors.pin && <p className="text-red-500 text-xs">{errors.pin}</p>}
          </div>
        </div>

        {/* Personal Details */}
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
            {errors.identificationType && <p className="text-red-500 text-xs">{errors.identificationType}</p>}
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
            {errors.identificationNumber && <p className="text-red-500 text-xs">{errors.identificationNumber}</p>}
          </div>
        </div>

        {/* Date of Birth */}
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
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            {errors.day && <p className="text-red-500 text-xs">{errors.day}</p>}
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
              {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
            {errors.month && <p className="text-red-500 text-xs">{errors.month}</p>}
          </div>
          <div>
            <label className="block text-left text-sm font-medium text-gray-700">Year</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Enter year"
            />
            {errors.year && <p className="text-red-500 text-xs">{errors.year}</p>}
          </div>
        </div>

        {/* Captcha Section */}
        <div className="relative -mx-10">
          <h2 className="text-left pl-10 text-lg font-semibold bg-red-600 text-white p-2 mb-4">3. Extra security check</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
          <div className="flex flex-col">
            <label className="block text-left text-sm font-medium text-gray-700">Generated Captcha</label>
            <div className="mt-2 font-mono bg-gray-100 px-4 py-2 rounded">{captcha}</div>
            <button onClick={generateCaptcha} className="text-sm text-blue-600 hover:underline mt-1 text-left">Get another code</button>
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
            {errors.captchaInput && <p className="text-red-500 text-xs">{errors.captchaInput}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-red-600 text-white py-3 px-16 rounded-md shadow-md hover:bg-red-700 disabled:bg-gray-400"
            disabled={!isFormValid}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OCBCSignUp;