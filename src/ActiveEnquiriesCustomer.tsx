import Navbar from "./components/Navbar";

function Enquiries({ type }) {
    // hardcoded data for now 
    const enquiries = {
        "OCBC Mobile App": [
            ["Issues logging into app, forgot password and would like to reset", "Active"],
            ["Cannot transfer money", "Past"]
        ],
        "Credit Card": [
        ],
        "Loans": [
        ]
    };

    let enquiryElements = [];
    for (const [key, value] of Object.entries(enquiries)) {
        enquiryElements.push(
            <div className="w-full p-4 rounded mt-6" key={key}>
                {value
                    .filter(enquiry => (type === "Active" ? enquiry[1] === "Active" : enquiry[1] === "Past"))
                    .map((enquiry, index) => {
                        return (
                            <div
                                key={index}
                                className="bg-white w-full p-3 shadow-md rounded mt-1 flex items-center"  
                            >
                                <p className="font-sans text-gray-800 text-sm flex-grow">
                                    {`${key} - ${enquiry[0]}`}
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
    return (
        <>
            <Navbar />
            <div className="w-full h-screen bg-cover bg-gray-50 px-10">
                <h1 className="lg:text-3xl md:text-xl sm:text-base font-semibold md:ml-40 mt-8 ml-40">Open Enquiries</h1>
                <div className="flex justify-center gap-10 mt-10">
                    <div className="bg-gray-100 w-2/3 px-8 py-6 shadow-lg rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Active Enquiries</h2>
                        <Enquiries type="Active" />
                        <div className="flex justify-center mt-6">
                            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500">
                                Make a New Enquiry
                            </button>
                        </div>
                    </div>
                    <div className="bg-gray-100 w-1/3 px-8 py-6 shadow-lg rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Past Enquiries</h2>
                        <Enquiries type="Past" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ActiveEnquiriesCustomer;
