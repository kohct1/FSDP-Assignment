import Navbar from "./components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';

const Queue = () => {
    const [queueCount, setQueueCount] = useState(0);
    const [leftQueue, setLeftQueue] = useState(0);
    const [lastUpdatedTime, setLastUpdatedTime] = useState('');
    const [initialQueueCount, setInitialQueueCount] = useState<number | null>(null);
    const [initialLeftQueue, setInitialLeftQueue] = useState<number | null>(null);

    const navigate = useNavigate();
    const queueAhead = Math.max(queueCount - leftQueue - 1, -1);
    const waitingTime = ((queueAhead * 2) / 60).toFixed(2); // Assume each person takes 2 mins

    // Function to format the current time as hh:mm:ss AM/PM
    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours() % 12 || 12;
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
        return `${hours}:${minutes}:${seconds} ${ampm}`;
    };

    // Fetch queue data from the backend
    const fetchQueueData = async () => {
        try {
            const response = await fetch('http://localhost:5050/queue');
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched data:", data);
                setQueueCount(data.queueCount);
                setLeftQueue(data.leftQueue);

                // Update last updated time to the current time
                setLastUpdatedTime(getCurrentTime());
            } else {
                console.error("Failed to fetch queue data");
            }
        } catch (error) {
            console.error("Error fetching queue data", error);
        }
    };

    // Set initial queue values once when data is first fetched
    useEffect(() => {
        if (initialQueueCount === null && initialLeftQueue === null && queueCount && leftQueue) {
            setInitialQueueCount(queueCount);
            setInitialLeftQueue(leftQueue);
            console.log("Initial counts set:", { queueCount, leftQueue });
        }
    }, [queueCount, leftQueue, initialQueueCount, initialLeftQueue]);

    // Calculate progress
    const newDeparturesSinceJoining = leftQueue - (initialLeftQueue || 0);
    const progress = initialQueueCount 
        ? Math.min((newDeparturesSinceJoining / initialQueueCount) * 100, 100) // Cap at 100%
        : 0;

    // // Redirect if queueAhead is 0
    // useEffect(() => {
    //     console.log("Queue Ahead:", queueAhead);  // Log queueAhead value for debugging
    //     if (queueAhead === 0) {
    //         navigate('/callpage'); 
    //     }
    // }, [queueCount, leftQueue, queueAhead, navigate]);

    // Fetch queue data on component mount and set up polling
    useEffect(() => {
        fetchQueueData();
        const intervalId = setInterval(fetchQueueData, 10000); // Refresh every 10 seconds
        console.log("Queue Ahead:", queueAhead);  // Log queueAhead value for debugging
        if (queueAhead === 0) {
            navigate('/callpage'); 
        }
        return () => clearInterval(intervalId);
    }, [queueCount, leftQueue, queueAhead, navigate]);

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
                        Estimated Waiting Time: <strong>{waitingTime} hours</strong>
                    </p>

                    <p className="text-sm text-black-500 mt-2">
                        Status Last Updated: {lastUpdatedTime}
                    </p>

                    <p className="mt-4 text-sm text-black-700">
                        If it is not an urgent matter, please{' '}
                        <Link to="/bookingpage" className="text-blue-700 underline">book a slot</Link> instead.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Queue;
