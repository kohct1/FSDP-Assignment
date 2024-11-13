import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Enquiries({ type }) {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [enquiries, setEnquiries] = useState([]);

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchEnquiries();
        }
    }, [userId]);

    async function getUser() {
        const response = await fetch(`http://localhost:5050/decode/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),
            }),
        });

        const result = await response.json();
        setUserId(result.userId);
        console.log(result.userId);
    }

    async function fetchEnquiries() {
        const response = await fetch("http://localhost:5050/enquiries/user");
        const data = await response.json();
        
        const userEnquiries = Array.isArray(data)
            ? data 
            : data.enquiries || []; 
    
        setEnquiries(userEnquiries);
    }

    // Filter enquiries based on type and render a message if no enquiries found
    const filteredEnquiries = enquiries.filter(enquiry =>
        type === "Active"
            ? enquiry.status === "Open" || enquiry.status === "Responding"
            : enquiry.status === "Closed"
    );

    const enquiryElements = filteredEnquiries.length > 0
        ? filteredEnquiries.map((enquiry, index) => (
            <div
                key={index}
                className="bg-white w-full p-3 shadow-md rounded mt-1 flex items-center cursor-pointer z-10 opacity-100"
                onClick={() => {
                    navigate("/user/enquiries/response", { state: { enquiry } });
                }}
            >
                <p className="font-sans text-gray-800 text-sm flex-grow">
                    {`${enquiry.type || "Enquiry"} - ${enquiry.message || "Undefined"}`}
                </p>
            </div>
        ))
        : <p className="text-gray-500 text-center mt-4">
            {type === "Active" ? "No active enquiries found." : "No closed enquiries found."}
          </p>;

    return <>{enquiryElements}</>;
}

function ActiveEnquiriesCustomer() {
    const navigate = useNavigate();

    return (
        <div
            className="relative flex flex-col min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/images/enquiriescustomer.jpeg')" }}
        >
            <div className="absolute inset-0 bg-white opacity-30"></div>

            <Navbar />
            <div className="relative w-full h-screen px-10">
                <h1 className="lg:text-3xl md:text-xl sm:text-base font-semibold md:ml-40 mt-8 ml-40">
                    Open Enquiries
                </h1>
                <div className="flex justify-center gap-10 mt-10">
                    <div className="bg-gray-100 w-2/3 px-8 py-6 shadow-lg rounded-lg opacity-70">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Active Enquiries</h2>
                        <Enquiries type="Active" />
                        <div className="flex justify-center mt-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
                                onClick={() => navigate("/user/enquiries/make")}
                            >
                                Make a New Enquiry
                            </motion.button>
                        </div>
                    </div>

                    <div className="bg-gray-100 w-1/3 px-8 py-6 shadow-lg rounded-lg opacity-70">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Past Enquiries</h2>
                        <Enquiries type="Past" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActiveEnquiriesCustomer;
