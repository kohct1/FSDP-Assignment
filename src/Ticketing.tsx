import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

const Ticketing = () => {
    const [queueCount, setQueueCount] = useState(0);
    const [leftQueue, setLeftQueue] = useState(0); // New state for leftQueue
    const [lastUpdatedTime, setLastUpdatedTime] = useState("");
    const navigate = useNavigate();

   // Fetch queue data from the backend
   const fetchQueueData = async () => {
        try {
            const response = await fetch("http://localhost:5050/queue");
            if (response.ok) {
                const data = await response.json();
                setQueueCount(data.queueCount);
                setLeftQueue(data.leftQueue);
                setLastUpdatedTime(getCurrentTime());
            } else {
                console.error("Failed to fetch queue data");
            }
        } catch (error) {
            console.error("Error fetching queue data:", error);
        }
    };

    // Increment queue count by calling the backend
    const startQueue = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5050/queue', {
                method: 'POST',
            });
            if (response.ok) {
                fetchQueueData(); // Refresh queue data after incrementing
            } else {
                console.error("Failed to increment queue count");
            }
        } catch (error) {
            console.error("Error incrementing queue count", error);
        }
        navigate("/queue");
    };

    // Function to format the current time as hh:mm:ss AM/PM
    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours() % 12 || 12;
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        const ampm = now.getHours() >= 12 ? "PM" : "AM";
        return `${hours}:${minutes}:${seconds} ${ampm}`;
    };

    // Calculate waiting time in minutes
    const calculateDynamicWaitingTime = () => {
        const queue = Math.max(queueCount - leftQueue, 0); // Ensure queue is non-negative
        const servers = 5; // Number of agents/servers
        const shiftDuration = 8 * 60; // Shift duration in minutes (8 hours)
        const callsPerShift = 40; // Average calls handled per agent per shift
        const arrivalRate = queue > 0 ? queue / shiftDuration : 0.1; // Avoid zero
        const serviceRate = callsPerShift / shiftDuration || 0.1; // Avoid zero
        const rho = Math.min(arrivalRate / (servers * serviceRate), 0.99); // Cap at <1

        const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

        const P0 = (() => {
            let sum = 0;
            for (let n = 0; n < servers; n++) {
                sum += Math.pow(arrivalRate / serviceRate, n) / factorial(n);
            }
            const term = Math.pow(arrivalRate / serviceRate, servers) /
                (factorial(servers) * (1 - rho));
            return 1 / (sum + (rho < 1 ? term : 0));
        })();

        const Lq = (Math.pow(arrivalRate / serviceRate, servers) * P0 * rho) /
            (factorial(servers) * Math.pow(1 - rho, 2));

        const Wq = Lq / Math.max(arrivalRate, 1); // Ensure arrivalRate is non-zero
        return Math.max(Wq, 0).toFixed(2); // Ensure non-negative waiting time
    };

    const waitingTime = calculateDynamicWaitingTime();

    useEffect(() => {
        fetchQueueData();
        const intervalId = setInterval(fetchQueueData, 30000); // Poll every 30 seconds
        return () => clearInterval(intervalId);
    }, []);

    const currentQueueCount = Math.max(queueCount - leftQueue, 0);

    return (
        <div className="relative flex flex-col min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/src/ticketing_bg.jpg')" }}>
            
            <div className="absolute inset-0 bg-white opacity-50"></div>

            <Navbar />

            <div className="relative z-10 flex justify-center items-center flex-grow">
                <div className="bg-white shadow-lg rounded-lg p-10 text-center max-w-md opacity-100">
                    <h2 className="text-lg font-medium">There are currently</h2>
                    <h1 className="text-6xl font-bold my-4">{currentQueueCount}</h1>
                    <p className="text-lg">People in the Queue</p>

                    <form onSubmit={startQueue}>
                        <motion.button
                            className="bg-red-600 text-white text-lg font-semibold px-6 py-3 rounded mt-8"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}>
                            Join the Queue
                        </motion.button>
                    </form>

                    <p className="text-lg">
                        Estimated Waiting Time: <strong>{waitingTime} minutes</strong>
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Status Last Updated: {lastUpdatedTime}
                    </p>

                    <p className="mt-4 text-sm text-black-700">
                        If it is not an urgent matter, please{' '}
                        <Link to="/bookingpage" className="text-blue-700 underline">book a slot</Link> instead.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Ticketing;
