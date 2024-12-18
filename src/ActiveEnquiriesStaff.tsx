import { ObjectId } from "mongoose";
import Navbar from "./components/Navbar";
import { useState, useEffect } from 'react';
import { decodeToken } from "react-jwt";
import { createPortal } from 'react-dom';
import ModalContent from "./components/StaffModalContainer.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

function ActiveEnquiriesStaff() {
    const [enquiryData, setData] = useState<any>([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    async function getEnquiries() {
        const response = await fetch("http://localhost:5050/enquiries/staff/open");
        const enquiryData = await response.json();
        setData(enquiryData["enquiries"]);
    }

    function saveEnquiryData(enquiryId: string, staffId: string, status: string, enquiry: any) {
        if (status !== "Other Staff Responding") {
            console.log("Clicked");
            localStorage.setItem("currentEnquiryID", enquiryId);
            localStorage.setItem("currentEnquiry", JSON.stringify(enquiry));  
            localStorage.setItem("currentStaffId", staffId);
            localStorage.setItem("currentStatus", status);
            setShowModal(true);
        }
    }

    async function updateResponding(enquiryId : string, staffId : string, status: string, enquiry : any) {
        if (status != "Other Staff Responding") {
            console.log("Attempting update");
            await fetch("http://localhost:5050/enquiries/staff/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: enquiryId,
                    responseBy: staffId
                })
            });
            //Access enquiry conversation here
            localStorage.setItem("responseId", enquiryId);
            enquiry["responseBy"] = staffId; 
            navigate("/enquiries/response", { state: { enquiry } });
        }
    }
    async function closeEnquiry(enquiryId : string) {
        
        if (status != "Other Staff Responding") {
            console.log("Attempting to close enquiry");
                await fetch("http://localhost:5050/enquiries/staff/close", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: enquiryId,
                })
            });
            window.location.reload();
            
        }
    }
   
    useEffect(()=> {   
        getEnquiries();   
    }, []);

    let token : string;

    let enquiryTypes: any[] = [];
    token = localStorage.getItem("token")?.toString()!;
    const decodedObject = decodeToken(token);
    const decodedId = decodedObject["userId"];

    // Check all enquiry types and store one of each type
    for (let enquiry in enquiryData) {
        if (!enquiryTypes.includes(enquiryData[enquiry]["type"])) {
            enquiryTypes.push(enquiryData[enquiry]["type"]);
        }
    }

    // Create and push JSX for each section of enquiry
    let count = 0;

    let enquiryElements: any = [];

    for (let enquiryType in enquiryTypes) {
        let enquiryCategory = (
            <div className="bg-red-600 w-1/5 p-2 shadow-lg rounded ml-12 mt-10 mb-7 enquiry-category ">
                <p className="font-sans text-white text-xs text-center font-medium md:text-lg sm:text-md">
                    {enquiryTypes[enquiryType]}
                </p>
            </div>
        );
        enquiryElements.push(enquiryCategory);

        let enquiryTypedData = enquiryData.filter((enquiry: { type: any; }) => enquiry.type == enquiryTypes[count]);

        let enquiryElement = enquiryTypedData.map((enquiry: {status: String; message: String; type: String, postedBy: String, _id: ObjectId, responseBy: String}) => {
            let status = enquiry.status;
            let opacity = "";
            let hover = "hover:bg-gray-200";
            let cursor = "hover:cursor-pointer";
    
            if (status == "Responding") {
                if(decodedId == enquiry.responseBy) {
                    status = "Currently Responding";
                } else {
                    opacity = "opacity-50";
                    cursor = "hover:cursor-default";
                    hover = "";
                    status = "Other Staff Responding";
                }

            }
            else if (status == "Open") {
                status = "";
            }
            else if (status == "Closed") {
                return null;
            }
            else {
                return null;
            }
            let classes = "bg-white w-9/12 p-3 shadow-lg rounded ml-12 mt-5 mb-6 enquiry flex sm:w-11/12"
            classes += " " + hover + " " + opacity + " " + cursor;
            let enquiryId = enquiry._id.toString();

            let staffId: string = "";

            if (localStorage.getItem("currentStaffId")) {
                staffId = localStorage.getItem("currentStaffId");
            }
           
            return (
                <>
                    <Dialog>
                        <DialogTrigger className="w-full" disabled={status === "Other Staff Responding"}>
                            <div className = {classes} onClick={() => saveEnquiryData(enquiryId, decodedId, status, enquiry)} id={count.toString()}>
                                <p className="font-sans text-black font-medium pl-2 text-xs sm:text-sm md:text-base" >{enquiry.type}   -</p>
                                <p className="font-sans text-black pl-2 text-xs sm:text-sm md:text-base">{enquiry.message}</p>
                                <p className="font-sans text-black pl-2 font-medium ml-auto mr-8 text-xs sm:text-small md:text-base">{status}</p>
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader className="flex flex-col gap-4">
                                <h2 className="text-xl font-semibold text-gray-700">Manage Enquiry</h2>
                                <button onClick={() => updateResponding(enquiryId, staffId, status, enquiry)} className="text-white bg-red-600 px-4 py-2 rounded">Respond</button>
                                <button onClick={() => closeEnquiry(enquiryId)} className="text-white bg-red-600 px-4 py-2 rounded">Close Enquiry</button>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </>
            );
        });
       
        enquiryElements.push(enquiryElement);
        count++;
    }

    return (
        <>
            <Navbar />
            <div className="w-full h-screen">
                <h1 className="lg:text-3xl md:text-xl sm:text-base font-semibold md:ml-40 mt-8 ml-40">Open Enquiries</h1>
                <div className="drop-shadow-lg w-4/5 bg-slate-100 h-3/4 m-auto mt-8 rounded-lg flex-col justify-around overflow-auto pb-14 pt-2" id="enquiries-container">
                    <div className="w-1/5 text-gray-200 h-0">2</div>
                    {enquiryElements}
                </div>
            </div>
        </>
    );
}

export default ActiveEnquiriesStaff;
