import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";

function Login() {
    const [email, setEmail] = useState<string>("");
    const [pin, setPin] = useState<string>("");
    const navigate = useNavigate();

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
        console.log(result);

        if (result.token) {
            localStorage.setItem("token", result.token);
            navigate("/home");
        } 
    }

    return (
        <>
            <Navbar />
            <div className="w-full h-screen flex justify-center items-center">
                <div className="w-1/4 h-fit flex flex-col justify-between rounded border-2 pt-8">
                    <div className="flex flex-col px-12 pt-8 py-20 gap-8">
                        <h1 className="text-3xl font-semibold">Online Banking</h1>
                        <input className="border-b-2 outline-0 px-4 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input className="border-b-2 outline-0 px-4 py-2" placeholder="PIN" value={pin} onChange={(e) => setPin(e.target.value)} />
                        <button className="bg-red-600 rounded text-white font-semibold py-2" onClick={login}>Login</button>
                        <h1 className="w-full text-blue-600 text-sm text-center">No Email/PIN? Click here.</h1>
                    </div>
                    <div className="w-full flex bg-slate-100 text-xs px-12 py-4 gap-2">
                        <h1>Don't have online banking?</h1>
                        <h1 className="text-blue-600">Sign up now</h1>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login
