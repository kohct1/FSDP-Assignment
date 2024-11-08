import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useState, useEffect } from "react";

function Enquiries({ type }) {
    const navigate = useNavigate(); // Initialize navigate
    const [userId, setUserId] = useState(null);
    const [enquiries, setEnquiries] = useState([]);

    useEffect(() => {
        getUser();
        fetchEnquiries();
      }, []);

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
        console.log(result.userId);
      }

      async function fetchEnquiries() { //Fetching enquiries from the server
        const response = await fetch("http://localhost:5050/Enquiries");
        const data = await response.json();
        setEnquiries(data);
    }

    let enquiryElements = [];
    for (const [key, value] of Object.entries(enquiries)) {
        enquiryElements.push(
            <div className="w-full p-4 rounded mt-6" key={key}>
                {value
                    .filter(enquiry => (type === "Active" ? enquiry.status === "Open" : enquiry.status === "Closed"))
                    .map((enquiry, index) => {
                        return (
                            <div
                                key={index}
                                className="bg-white w-full p-3 shadow-md rounded mt-1 flex items-center cursor-pointer z-10 opacity-100"
                                onClick={() => navigate("/user/enquiries/response")} // Add onClick for redirection
                            >
                                <p className="font-sans text-gray-800 text-sm flex-grow">
                                {`${enquiry.type || "Enquiry"} - ${enquiry.message || "Undefined"}`}
                                </p>
                            </div>
                        );
                    })}
            </div>
        );
    }

    return <>{enquiryElements}</>;
}

function ActiveEnquiriesCustomer() {
    const navigate = useNavigate(); // Initialize navigate for this component

    return (
        <div className="relative flex flex-col min-h-screen bg-cover bg-center"
         style={{ backgroundImage: "url('/images/enquiriescustomer.jpeg')" }}>

        {/* Overlay for background fade */}
        <div className="absolute inset-0 bg-white opacity-30"></div>

            <Navbar />
            <div className="relative w-full h-screen px-10">
                <h1 className="lg:text-3xl md:text-xl sm:text-base font-semibold md:ml-40 mt-8 ml-40">Open Enquiries</h1>
                <div className="flex justify-center gap-10 mt-10">

                    <div className="bg-gray-100 w-2/3 px-8 py-6 shadow-lg rounded-lg opacity-70">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Active Enquiries</h2>
                        <Enquiries type="Active" />
                        <div className="flex justify-center mt-6">
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
                                onClick={() => navigate("/user/enquiries/make")} // Redirect on button click
                            >
                                Make a New Enquiry
                            </button>
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
