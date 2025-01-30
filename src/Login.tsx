import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import {createPortal} from 'react-dom';
import ModalContent from "./components/RegModalContent.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";




function Login() {
    const [email, setEmail] = useState<string>("");
    const [pin, setPin] = useState<string>("");
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [showModal, setShowModal] = useState(false);
    const [showLoginModal, setLoginModal] = useState(false);
    const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
    const navigate = useNavigate();
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    async function login(): Promise<void> {
        const response = await fetch("http://localhost:5050/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                pin: pin
            })
        });
        const result = await response.json();
     

        if (result.token)  {
            localStorage.setItem("token", result.token);
            getUserRole(email);
            const tempArray = email.split('@');
            const username = tempArray[0].charAt(0).toUpperCase() + tempArray[0].slice(1);
            localStorage.setItem('username', username);
            setLoginModal(false);
            navigate("/homepage");
           
        }
        else {
            console.log("credentials invalid");
            setLoginModal(true);
        }
    }
    async function getUserRole(email : String) {
        
        const response = await fetch(`http://localhost:5050/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
       
        const result = await response.json();
        console.log(result.user);
        let keys = Object.keys(result.user);
        for(let i = 0; i < keys.length; i++) {
            if(result.user[i]["email"] == email) {
               
                localStorage.setItem("role", result.user[i]["role"]);
                console.log(result.user[i]["email"]);
            }  
        }
       
        
       
    }

    async function register(): Promise<void> {
        await fetch("http://localhost:5050/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                pin: pin
            })

        });
    }
    
    async function checkEmail(): Promise<void> {
        const response = await fetch("http://localhost:5050/checkEmail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email
            })
        });

        const result = await response.json();

        if (!result.user) {
            setRegisterSuccess(true)
            executeRegistration();
        } else {
            setRegisterSuccess(false);
        }
    }

    //Triggers both the post method and popup
    function executeRegistration() {
        register();
        setShowModal(true);
    }

    if (isLogin) {
        return (
            <>
                <div className="w-full h-screen flex justify-center items-center">
                    <div className="w-1/4 md:h-fit h-50% flex flex-col justify-between rounded border-2 pt-8">
                        <div className="flex flex-col px-12 lg:pt-8 lg:pb-16 gap-8 pb-4 pt-4">
                            <h1 className="lg:text-3xl font-semibold text-xl ml-auto mr-auto pb-2">OCBC Online</h1>
                            <input className="border-b-2 outline-0 px-4 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <input type="password" className="border-b-2 outline-0 px-4 py-2" placeholder="PIN" value={pin} onChange={(e) => setPin(e.target.value)} />
                            <Dialog>
                                <DialogTrigger className="w-full">
                                    <motion.button className=" w-full bg-red-600 rounded text-white font-semibold py-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={login}>Login</motion.button>
                                </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            {showLoginModal ? 
                                                <>
                                                    <DialogTitle>Login Credentials Invalid!</DialogTitle>
                                                    <DialogDescription>
                                                        Please check that your username or password is entered correctly.
                                                    </DialogDescription>
                                                    <DialogFooter>
                                                        <DialogClose>
                                                            <motion.button className="bg-red-600 text-sm text-white rounded px-4 py-2 mt-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button">Close</motion.button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </> 
                                                : null

                                            }
                                        </DialogHeader>
                                    </DialogContent>
                            </Dialog>
                            <h1 className="w-full text-blue-600 text-sm text-center">No Email/PIN? Click here.</h1>
                        </div>
                        <div className="w-full flex bg-slate-100 text-xs px-12 py-4 gap-2">
                            <h1>Don't have online banking?</h1>
                            <h1 className="text-blue-600" onClick={() => setIsLogin(false)}>Sign up now</h1>
                        </div>
                    </div>
                </div>
            </>
        );

    }

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div className="w-1/4 h-fit flex flex-col justify-between rounded border-2 pt-8">
                <div className="flex flex-col px-12 gap-8 md:pt-8 md:pb-16 gap-8 pb-4 pt-4">
                    <h1 className="text-3xl font-semibold pb-2 ml-auto mr-auto">OCBC Online</h1>
                    <input className="border-b-2 outline-0 px-4 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    <input className="border-b-2 outline-0 px-4 py-2" placeholder="PIN" value={pin} onChange={(e) => setPin(e.target.value)} required/>
                    <Dialog>
                        <DialogTrigger className="w-full">
                            <motion.button className="w-full bg-red-600 rounded text-white font-semibold py-2" onClick={checkEmail} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Register</motion.button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                {registerSuccess ? 
                                    <>
                                        <DialogTitle>Account successfully created!</DialogTitle>
                                        <DialogDescription>
                                            You can now login using your newly created account details.
                                        </DialogDescription>
                                        <DialogFooter>
                                            <motion.button className="bg-red-600 text-sm text-white rounded px-4 py-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsLogin(true)}>Next</motion.button>
                                        </DialogFooter>
                                    </> :
                                    <>
                                        <DialogTitle>Email used already exists</DialogTitle>
                                        <DialogDescription>
                                            Please use a different email, the one you have used is currently in use.
                                        </DialogDescription>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <motion.button className="bg-red-600 text-sm text-white rounded px-4 py-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Next</motion.button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </>}
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <h1 className="w-full text-blue-600 text-sm text-center">No Email/PIN? Click here.</h1>
                </div>
                <div className="w-full flex bg-slate-100 text-xs px-12 py-4 gap-2">
                    <h1>Already have online banking?</h1>
                    <h1 className="text-blue-600" onClick={() => setIsLogin(true)}>Login now</h1>
                </div>
            </div>
        </div>
    );
}

export default Login
