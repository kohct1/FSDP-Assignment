import Navbar from "./components/Navbar";
/*Will develop backend later so using dummy data first
Data structured: Category : [Enquiry : Status]
*/




async function GetEnquiries() {
    const response = await fetch("https://localhost:5050/enquiries/staff");
    if (!response.ok) {
        console.error('Error:', response.statusText);
    } else {
        const data = await response.json();
        console.log(data);
    }
}
function Enquiries(){


    const enquiries = 
    {   "OCBC Mobile App" : [["Issues logging into app, forgot password and would like to reset", "None"], ["Cannot transfer money", "Other"]], 
        "Credit Card" : [["Information for benefits about OCBC INFINITY cashback card", "Responding"], ["How to apply for credit card with OCBC?", "None"]],
        "Loans" : [["Interest rate on housing mortgage information", "None"], ["More info on Cash-on-Instalments"]]
    };
    

    let enquiryElements = [];
    for(const [key, value] of Object.entries(enquiries)) {
        enquiryElements.push(<div className="bg-red-600 w-1/5 p-2 shadow-lg rounded ml-12 mt-10 mb-7 enquiry-category">
                            <p className="font-sans text-white text-xs text-center font-medium md:text-lg sm:text-md">{key}</p>
                           </div>)  
        value.forEach(function (enquiry) {
            let status = enquiry[1];
            let opacity = "";
            let hover = "hover:bg-gray-200";
            let cursor = "hover:cursor-pointer";
            if(status == "Other") {
                opacity = "opacity-50";
                cursor = "hover:cursor-default";
                hover = "";
                status = "Other Staff Responding";
            }
            else if (status == "Responding") {
                status = "Currently Responding";
            }
            else {
                status = "";
            }
            let classes = "bg-white w-9/12 p-3 shadow-lg rounded ml-12 mt-5 mb-6 enquiry flex last:mb-14 sm:w-11/12"
            classes += " " + hover + " " + opacity + " " + cursor;

            enquiryElements.push(<div className = {classes}>
                                    <p className="font-sans text-black font-medium pl-2 text-xs sm:text-sm md:text-base">{key}   -</p>
                                    <p className="font-sans text-black pl-2 text-xs sm:text-sm md:text-base">{enquiry[0]}</p>
                                    <p className="font-sans text-black pl-2 font-medium ml-auto mr-8 text-xs sm:text-small md:text-base">{status}</p>
                                </div>)
        });
    }
    return <>{enquiryElements}</>;
}

function ActiveEnquiriesStaff() {
    return (
        <>
            <Navbar />
            <div className="w-full h-screen">
                <h1 className="lg:text-3xl md:text-xl sm:text-base font-semibold md:ml-40 mt-8 ml-40">Open Enquiries</h1>
                <div className="drop-shadow-lg w-4/5 bg-slate-100 h-3/4 m-auto mt-8 rounded-lg flex-col justify-around overflow-auto" id="enquiries-container">
                    <div className="w-1/5 text-gray-200 h-0">2</div>
                    <Enquiries/>
                    
                </div>

            </div>
        </>
    );
}

export default ActiveEnquiriesStaff;
