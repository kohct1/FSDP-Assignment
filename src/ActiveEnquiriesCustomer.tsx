import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";


function ActiveEnquiriesCustomer() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [activeEnquiries, setActiveEnquiries] = useState();
    const [pastEnquiries, setPastEnquiries] = useState();
    const [pastElements, setPastElements] = useState();
    const [presentElements, setPresentElements] = useState();
 
    useEffect(() => {
        getUser();
        fetchEnquiries();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchEnquiries();
        }
    }, [userId]);

    let pastEnquiryElements : any = [];
    let activeEnquiryElements : any = []; 

    useEffect(()=> {
        console.log(pastEnquiries);
        
        pastEnquiryElements = pastEnquiries?.map((enquiry : any) => {
            return(<>
                <div key={enquiry._id} className="bg-white w-full p-3 shadow-md rounded mt-1 flex items-center cursor-pointer z-10 opacity-100 hover:bg-gray-200" onClick={() => handleClick(enquiry._id.toString())}>
                    <p className="font-sans text-gray-800 text-sm flex-grow">
                        {`${enquiry.type || "Enquiry"} - ${enquiry.message || "Undefined"}`}
                    </p>
                </div></>)
        });
    
        activeEnquiryElements = activeEnquiries?.map((enquiry : any) => {
            return(<>
                <div key={enquiry._id} className="bg-white w-full p-3 shadow-md rounded mt-1 flex items-center cursor-pointer z-10 opacity-100 hover:bg-gray-200" onClick={() => handleClick(enquiry._id.toString())}>
                    <p className="font-sans text-gray-800 text-sm flex-grow">
                        {`${enquiry.type || "Enquiry"} - ${enquiry.message || "Undefined"}`}
                    </p>
                </div></>)
        });
        setPastElements(pastEnquiryElements);
        setPresentElements(activeEnquiryElements);
    }, [pastEnquiries]);

    

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
    }

    async function fetchEnquiries() {
        const response = await fetch("http://localhost:5050/enquiries");
        const enquiryData = await response.json();
        console.log(enquiryData);
        let aEnquiries = [];
        let pEnquiries = [];
      
        for(let i = 0; i < enquiryData["enquiries"].length; i++) {
            if(enquiryData["enquiries"][i]["status"] == "Responding" || enquiryData["enquiries"][i]["status"] == "Open") {
                aEnquiries.push(enquiryData["enquiries"][i]);
            }
            else {
                pEnquiries.push(enquiryData["enquiries"][i]);
            }
        }
        console.log(pEnquiries);
        setActiveEnquiries(aEnquiries);
        setPastEnquiries(pEnquiries);
    }

    function handleClick(enquiryId : string) {
        localStorage.setItem("currentEnquiryID", enquiryId);
        navigate("/enquiries/response");
    }


    return (
        <div
            className="relative flex flex-col min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/images/enquiriescustomer.jpeg')" }}
        >
            <div className="absolute inset-0 bg-white opacity-30"></div>

            <Navbar />
            <div className="relative w-full h-screen px-10">
                <div className="bg-gray-100 shadow-lg rounded-lg opacity-90 lg:w-[305px] pb-3 flex align-center pt-3 mt-10 md:w-[260px] w-[220px]">
                    <h1 className="lg:text-2xl md:text-xl sm:text-base font-semibold ml-10">
                        Customer Enquiries
                    </h1>
                </div>
                <div className="flex justify-center gap-10 mt-10">
                    <div className="bg-gray-100 w-2/3 px-8 py-6 shadow-lg rounded-lg opacity-90">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Active Enquiries</h2>
                        {
                            activeEnquiries?.length != 0 ? presentElements : 
                            <p className="text-gray-500 text-center mt-4">
                                "No active enquiries found."
                            </p>
                        }
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
                    <div className="bg-gray-100 w-1/3 px-8 py-6 shadow-lg rounded-lg opacity-90">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Past Enquiries</h2>
                        {
                            pastEnquiries?.length != 0 ? pastElements :
                            <p className="text-gray-500 text-center mt-4">
                                "No closed enquiries found."
                            </p>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActiveEnquiriesCustomer;
