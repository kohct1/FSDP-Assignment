import { Link } from "react-router-dom";
import {decodeToken} from "react-jwt";
import {useNavigate} from "react-router-dom";

function PopulateLinks({role}) {
    if(role == "Customer") {
        return (  
        <div className="flex space-x-10">
            <Link to="/bookingpage" className="text-gray-600 font-semibold">Booking</Link>
            <Link to="/ticketing" className="text-gray-600 font-semibold">Queue</Link>
            <Link to="/user/enquiries/view" className="text-gray-600 font-semibold">Enquiry Portal</Link>
        </div>);
    }
    else if (role == "Staff") {
        console.log("Is staff");
        return (
            <div className="flex space-x-10">
                <Link to="/bookingpage" className="text-gray-600 font-semibold">Booking</Link>
                <Link to="/ticketing" className="text-gray-600 font-semibold">Queue</Link>
                <Link to="/staff/enquiries" className="text-gray-600 font-semibold">Enquiry Portal</Link>
            </div>
        );
    }
    else {
        return(null);
    }

}

function Navbar() {
    
    let token : string;
    let enquiryTypes: any[] = [];
    //compiler will complain if i dont parse as string       
    let decodedRole = null;
    token = localStorage.getItem("token")?.toString()!;
    if (token != null) {
        const decodedObject =  decodeToken(token);
        //This line may show an error, but it works as intended
        decodedRole = decodedObject["role"];
    }
   
    return (
        <div className="relative z-20 w-full border-b border-gray-300 p-4 bg-white bg-opacity-100 pl-20 pr-20">
                <div className="flex justify-between items-center w-full">
                    <img
                        src='/images/OCBC-Bank-Logo.png' // OCBC logo link
                        alt="OCBC Logo"
                        className="h-12"
                    />
                    <PopulateLinks
                        role = {decodedRole}
                    />
                </div>
            </div>
    ) 
}

export default Navbar
