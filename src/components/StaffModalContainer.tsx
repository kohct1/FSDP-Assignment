import {useNavigate} from "react-router-dom";

export default function StaffModalContent({onClose}) {
    const navigate = useNavigate();

    let enquiryId = localStorage.getItem("currentEnquiry");
    let staffId = localStorage.getItem("currentStaffId");
    let status = localStorage.getItem("currentStatus");
    console.log(enquiryId + " " + staffId + " " + status);


    async function updateResponding(enquiryId : string, staffId : string, status: string) {
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
            navigate("/user/enquiries/response", { replace: true });
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
    return (
        <div className="z-10 absolute ml-[37.7%] bg-slate-100 bottom-0 p-8 pl-28 pr-28 rounded-md flex justify-center flex-col mb-52 border-2 border-neutral-700 duration-75 flex flex-col justify-center pb-12">
            <h2 className="text-xl font-semibold text-gray-700">Manage Enquiry</h2>
            <button onClick={() => updateResponding(enquiryId, staffId, status)} className="text-gray-700 font-semibold mt-12 bg-white p-1 rounded-md border-2 border-slate-500">Respond</button>
            <button onClick={() => closeEnquiry(enquiryId)} className="text-gray-700 font-semibold mt-12 bg-white p-1 rounded-md border-2 border-slate-500">Close Enquiry</button>
            <button onClick={onClose} className="text-gray-700 font-semibold mt-12 bg-white p-1 rounded-md border-2 border-slate-500">Close</button>

        </div>
    )
}