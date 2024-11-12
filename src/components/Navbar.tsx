import { Link } from "react-router-dom"
import { useState, useEffect } from "react";
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
   
    const [userId, setUserId] = useState(null);
    const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getUser();
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

    //Logout handler
    const handleLogout = () => {
    // Clear user data (in this case, from localStorage)
        localStorage.removeItem('userId');
        setUserId(null);
        setShowLogoutPrompt(false); // Close the logout prompt
        navigate('/'); // Redirect to login page
    };

    //Show logout prompt
    const handleShowLogoutPrompt = () => {
         setShowLogoutPrompt(true);
    };

    // // Close logout prompt
    const handleCloseLogoutPrompt = () => {
        setShowLogoutPrompt(false);
    };

    return (
        <div className="relative z-20 w-full border-b border-gray-300 p-4 bg-white bg-opacity-100 pl-20 pr-20">
                <div className="flex justify-between items-center w-full">
                  
                    <Link to="/homepage">
                        <img
                            src='/images/OCBC-Bank-Logo.png' // OCBC logo link
                            alt="OCBC Logo"
                            className="h-12"
                        />
                    </Link>
                    <div className="flex space-x-10">
                    <PopulateLinks
                        role = {decodedRole}
                    />
                        {userId ? (
                            <button 
                                onClick={handleShowLogoutPrompt}
                                className="text-gray-600 font-semibold"
                            >
                                Logged In
                            </button>
                        ) : (
                            <Link to="/" className="text-gray-600 font-semibold">
                                Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* Logout confirmation modal */}
            {showLogoutPrompt && (
                <>
                <div className="fixed inset-0 bg-gray-800 bg-opacity-70 z-40"></div>

                <div className="absolute inset-40 flex justify-center items-center z-40 mt-[-80px]">
                    <div className="bg-white p-6 rounded-md shadow-lg text-center">
                        <h3 className="text-xl font-semibold mb-4">Are you sure you want to log out?</h3>
                        <div className="space-x-4">
                            <button 
                                onClick={handleLogout} 
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                Yes, Log Out
                            </button>
                            <button 
                                onClick={handleCloseLogoutPrompt} 
                                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                        {userId ? (
                            <button 
                                onClick={handleShowLogoutPrompt}
                                className="text-gray-600 font-semibold"
                            >
                                Logged In
                            </button>
                        ) : (
                            <Link to="/" className="text-gray-600 font-semibold">
                                Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* Logout confirmation modal */}
            {showLogoutPrompt && (
                <>
                <div className="fixed inset-0 bg-gray-800 bg-opacity-70 z-40"></div>

                <div className="absolute inset-40 flex justify-center items-center z-40 mt-[-80px]">
                    <div className="bg-white p-6 rounded-md shadow-lg text-center">
                        <h3 className="text-xl font-semibold mb-4">Are you sure you want to log out?</h3>
                        <div className="space-x-4">
                            <button 
                                onClick={handleLogout} 
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                Yes, Log Out
                            </button>
                            <button 
                                onClick={handleCloseLogoutPrompt} 
                                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
                </>
            )}


        
                </>
            )}
        </div>

        
    ) 
}

export default Navbar
