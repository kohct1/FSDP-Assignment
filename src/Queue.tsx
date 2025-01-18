import Navbar from "./components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Queue = () => {
    const [queueCount, setQueueCount] = useState(0);
    const [leftQueue, setLeftQueue] = useState(0);
    const [lastUpdatedTime, setLastUpdatedTime] = useState("");
    const [initialQueueCount, setInitialQueueCount] = useState<number | null>(null);
    const [initialLeftQueue, setInitialLeftQueue] = useState<number | null>(null);
    const navigate = useNavigate();

    // Function to format the current time as hh:mm:ss AM/PM
    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours() % 12 || 12;
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        const ampm = now.getHours() >= 12 ? "PM" : "AM";
        return `${hours}:${minutes}:${seconds} ${ampm}`;
    };

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

    // Leave the queue and navigate to the ticketing page
    const leaveQueue = async () => {
        try {
            const response = await fetch("http://localhost:5050/dequeue", {
                method: "POST",
            });
            if (!response.ok) {
                console.error("Failed to update left queue");
            }
        } catch (error) {
            console.error("Error updating left queue:", error);
        }
        navigate("/ticketing");
    };

    // Calculate dynamic waiting time based on queue data
    const calculateDynamicWaitingTime = () => {
        const queue = Math.max(queueCount - leftQueue, 0);
        const servers = 5;
        const shiftDuration = 8 * 60;
        const callsPerShift = 40;
        const arrivalRate = queue > 0 ? queue / shiftDuration : 0.1;
        const serviceRate = callsPerShift / shiftDuration || 0.1;
        const rho = Math.min(arrivalRate / (servers * serviceRate), 0.99);

        const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

        const P0 = (() => {
            let sum = 0;
            for (let n = 0; n < servers; n++) {
                sum += Math.pow(arrivalRate / serviceRate, n) / factorial(n);
            }
            const term = Math.pow(arrivalRate / serviceRate, servers) / (factorial(servers) * (1 - rho));
            return 1 / (sum + (rho < 1 ? term : 0));
        })();

        const Lq = (Math.pow(arrivalRate / serviceRate, servers) * P0 * rho) / (factorial(servers) * Math.pow(1 - rho, 2));

        const Wq = Lq / Math.max(arrivalRate, 1);
        return Math.max(Wq, 0).toFixed(2);
    };

    const waitingTime = calculateDynamicWaitingTime();

    // Set initial queue values once when data is first fetched
    useEffect(() => {
        if (initialQueueCount === null && initialLeftQueue === null && queueCount && leftQueue) {
            setInitialQueueCount(queueCount);
            setInitialLeftQueue(leftQueue);
        }
    }, [queueCount, leftQueue, initialQueueCount, initialLeftQueue]);

    // Calculate progress
    const newDeparturesSinceJoining = leftQueue - (initialLeftQueue || 0);
    const progress = initialQueueCount
        ? Math.min((newDeparturesSinceJoining / initialQueueCount) * 100, 100)
        : 0;

    // Determine the number of people ahead in the queue
    const queueAhead = Math.max(queueCount - leftQueue - 1, -1);

    // Fetch queue data on component mount and set up polling
    useEffect(() => {
        fetchQueueData();
        const intervalId = setInterval(fetchQueueData, 10000); // Refresh every 10 seconds
        if (queueAhead === 0) {
            navigate("/callpage");
        }
        return () => clearInterval(intervalId);
    }, [queueAhead, navigate]);

    return (
        <div className="relative flex flex-col min-h-screen bg-cover bg-center bg-[url('ticketing_bg.jpg')]">
            {/* Overlay for background fade */}
            <div className="absolute inset-0 bg-white opacity-50"></div>

            {/* Header positioned over the background */}
            <Navbar />

            {/* Main Content */}
            <main className="relative z-10 flex justify-center items-center flex-grow">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center opacity-100">
                    <h2 className="text-lg font-semibold">You Are Now in The Queue</h2>
                    <h1 className="text-6xl font-bold my-4">{queueAhead}</h1>
                    <p className="text-lg text-black-700">People Ahead of You</p>

                    {/* Progress Bar */}
                    <div className="mt-6 mb-8">
                        <div className="relative w-full h-2 bg-gray-300 rounded-full">
                            <div
                                className="absolute top-0 h-2 bg-red-600 rounded-full"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    <p className="text-lg">
                        Estimated Waiting Time: <strong>{waitingTime} minutes</strong>
                    </p>

                    <p className="text-sm text-black-500 mt-2">
                        Status Last Updated: {lastUpdatedTime}
                    </p>

                    <p className="mt-4 text-sm text-black-700">
                        If it is not an urgent matter, please{" "}
                        <Link to="/bookingpage" className="text-blue-700 underline">
                            book a slot
                        </Link>{" "}
                        instead.
                    </p>

                    {/* Leave Queue Button */}
                    <motion.button
                        className="bg-red-600 text-white text-lg font-semibold px-6 py-3 rounded mt-8"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={leaveQueue}
                    >
                        Leave Queue
                    </motion.button>
                </div>
            </main>
        </div>
    );
};

export default Queue;
