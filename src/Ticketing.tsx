import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

const Ticketing = () => {
    const [queueCount, setQueueCount] = useState(0);
    const [leftQueue, setLeftQueue] = useState(0); // New state for leftQueue
    const [lastUpdatedTime, setLastUpdatedTime] = useState('');
    const navigate = useNavigate();

    // Fetch queue data from the backend
    const fetchQueueData = async () => {
        try {
            const response = await fetch('http://localhost:5050/queue');
            if (response.ok) {
                const data = await response.json();
                setQueueCount(data.queueCount);
                setLeftQueue(data.leftQueue); // Set leftQueue

                // Format the timestamp if it exists
                if (data.lastUpdatedTime && data.lastUpdatedTime.$timestamp) {
                    const timestamp = data.lastUpdatedTime.$timestamp;
                    const formattedTime = new Date(timestamp).toLocaleString();
                    setLastUpdatedTime(formattedTime);
                } else {
                    setLastUpdatedTime(data.lastUpdatedTime);
                }
            } else {
                console.error("Failed to fetch queue data");
            }
        } catch (error) {
            console.error("Error fetching queue data", error);
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
                const data = await response.json();
                navigate("/queue");
            } else {
                console.error("Failed to increment queue count");
            }
        } catch (error) {
            console.error("Error incrementing queue count", error);
        }
        navigate("/queue");
    };

    // Calculate waiting time in hours
    const peopleInQueue = queueCount - leftQueue; // New calculation for people in queue
    const waitingTime = ((peopleInQueue * 20) / 10) / 60;

    useEffect(() => {
        fetchQueueData();
        const intervalId = setInterval(fetchQueueData, 30000); // Poll every 30 seconds
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="relative flex flex-col min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/src/ticketing_bg.jpg')" }}>
            
            <div className="absolute inset-0 bg-white opacity-50"></div>

            <Navbar />

            <div className="relative z-10 flex justify-center items-center flex-grow">
                <div className="bg-white shadow-lg rounded-lg p-10 text-center max-w-md opacity-100">
                    <h2 className="text-lg font-medium">There are currently</h2>
                    <h1 className="text-6xl font-bold my-4">{peopleInQueue}</h1>
                    <p className="text-lg">People in the Queue</p>

                    <form onSubmit={startQueue}>
                        <motion.button className="bg-red-600 text-white text-lg font-semibold px-6 py-3 rounded mt-8" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            Join the Queue
                        </motion.button>
                    </form>

                    <p className="mt-4 text-lg">
                        Estimated Waiting Time: <strong>{waitingTime.toFixed(2)} hours</strong>
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Status Last Updated: {lastUpdatedTime}
                    </p>

                    {/* Booking Suggestion */}
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
