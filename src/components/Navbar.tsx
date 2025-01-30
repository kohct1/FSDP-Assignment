import { Link } from "react-router-dom"
import { useState, useEffect } from "react";
import {decodeToken} from "react-jwt";
import {useNavigate} from "react-router-dom";
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

function PopulateLinks({ role, handleLogout }: { role: string, handleLogout: () => void }) {
    if(role == "Customer") {
        return (  
            <div className="flex items-center gap-8">
                <Link to="/bookingpage" className="text-gray-600 md:text-lg font-semibold text-sm hover:text-gray-900">Booking</Link>
                <Link to="/ticketing" className="text-gray-600 md:text-lg font-semibold text-sm hover:text-gray-900">Queue</Link>
                <Link to="/user/enquiries/view" className="text-gray-600 md:text-lg font-semibold text-sm hover:text-gray-900">Enquiries</Link>
                <Link to="/branches" className="text-gray-600 md:text-lg font-semibold text-sm hover:text-gray-900">Branches</Link>
                <Dialog>
                    <DialogTrigger>
                        <motion.button className="bg-red-600 rounded md:text-lg text-sm text-white font-semibold px-3 py-2 sm:ml-4 m-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Log out</motion.button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="mb-2">Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                You are logging out of your account. You can log in again in the login page.
                            </DialogDescription>
                            <DialogFooter>
                                <motion.button className="bg-red-600 text-sm text-white rounded px-4 py-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout}>Log out</motion.button>
                            </DialogFooter>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
    else if (role == "Staff") {
        return (
            <div className="flex items-center gap-8">
                <Link to="/bookingpage" className="text-gray-600 md:text-lg font-semibold text-sm hover:text-gray-900">Booking</Link>
                <Link to="/staff/queue" className="text-gray-600 md:text-lg font-semibold text-sm hover:text-gray-900"> Queue</Link>
                <Link to="/staff/enquiries" className="text-gray-600 md:text-lg font-semibold text-sm hover:text-gray-900">Enquiries</Link>
                <Dialog>
                    <DialogTrigger>
                        <motion.button className="bg-red-600 rounded sm:text-lg text-white font-semibold px-3 py-2 ml-4 " whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Log out</motion.button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="mb-2">Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                You are logging out of your account. You can log in again in the login page.
                            </DialogDescription>
                            <DialogFooter>
                                <motion.button className="bg-red-600 text-sm text-white rounded px-4 py-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout}>Log out</motion.button>
                            </DialogFooter>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
    else {
        return(
            <div className="flex space-x-10">
                <Link to="/" className="text-gray-600 font-semibold">Login</Link>
            </div>
        );
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
    }

    //Logout handler
    const handleLogout = () => {
    // Clear user data (in this case, from localStorage)
        localStorage.removeItem('userId');
        setUserId(null);
        navigate('/'); // Redirect to login page
    };

    return (
        <div className="relative z-20 w-full border-b border-gray-300 p-4 bg-white bg-opacity-100 pl-20 pr-20">
                <div className="flex justify-between items-center w-full">
                  
                    <Link to="/homepage">
                        <img
                            src='/images/OCBC-Bank-Logo.png' // OCBC logo link
                            alt="OCBC Logo"
                            className="h-12 opacity-0 sm:opacity-100 sm:w-full w-0"
                        />
                    </Link>
                    <PopulateLinks
                        role = {decodedRole}
                        handleLogout={handleLogout}
                    />
                </div>
        </div>

        
    ) 
}

export default Navbar
