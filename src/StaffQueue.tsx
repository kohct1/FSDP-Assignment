import Navbar from "./components/Navbar";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

const StaffQueue = () => {
    const [queueCount, setQueueCount] = useState(0);
    const [leftQueue, setLeftQueue] = useState(0);
    const [lastUpdatedTime, setLastUpdatedTime] = useState("");
    const [averageRating, setAverageRating] = useState("No ratings yet");
    const [recentFeedback, setRecentFeedback] = useState(null);
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

    // Fetch feedback summary data from the backend
    const fetchFeedbackSummary = async () => {
        try {
            const response = await fetch("http://localhost:5050/staff/feedbackSummary");
            if (response.ok) {
                const data = await response.json();
                setAverageRating(data.averageRating);
                setRecentFeedback(data.recentFeedback);
            } else {
                console.error("Failed to fetch feedback summary");
            }
        } catch (error) {
            console.error("Error fetching feedback summary:", error);
        }
    };

    // Call the next person in the queue
    const callNextPerson = () => {
        if (queueCount - leftQueue > 0) {
            setLastUpdatedTime(getCurrentTime());
            navigate('/webcall');
        } else {
            alert("No one in the queue to call!");
        }
    };

    // Setup polling and initial fetch
    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        const startPolling = () => {
            if (!intervalId) {
                intervalId = setInterval(fetchQueueData, 100); // Poll every 1ms
            }
        };

        const stopPolling = () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        };

        // Initial fetch
        fetchQueueData();
        fetchFeedbackSummary();

        // Start polling
        startPolling();

        return () => {
            // Cleanup polling
            stopPolling();
        };
    }, []);

    return (
        <div className="relative flex flex-col min-h-screen bg-cover bg-center bg-[url(/images/OCBCQueueBackground.jpg)]">
            {/* Overlay for background fade */}
            <div className="absolute inset-0 bg-white opacity-20"></div>

            {/* Header positioned over the background */}
            <Navbar />

            {/* Main Content */}
            <main className="relative z-10 flex justify-center items-center flex-grow">
                {/* Original Box */}
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center opacity-100 h-full">
                    <h2 className="text-lg font-semibold">Staff Queue Management</h2>

                    <div className="my-6">
                        <h3 className="text-xl font-bold">Queue Status</h3>
                        <p className="text-lg">Total in Queue: {queueCount}</p>
                        <p className="text-lg">Left Queue: {leftQueue}</p>
                        <p className="text-sm text-black-500 mt-2">
                            Status Last Updated: {lastUpdatedTime}
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Call Next Button */}
                        <motion.button
                            className="bg-red-600 text-white text-lg font-semibold px-6 py-3 rounded mt-8"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={callNextPerson}
                        >
                            Call Next Person
                        </motion.button>
                    </div>
                </div>

                {/* Stacked Boxes (Positioned to the Right, Same Height as Original Box) */}
                <div className="flex flex-col gap-4 ml-8 h-full">
                    {/* Box 1 */}
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center opacity-100 flex-1">
                        <p className="text-lg mt-4">
                            Average Rating: <span className="font-bold">{averageRating}</span>
                        </p>
                    </div>

                    {/* Box 2 */}
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center opacity-100 flex-1">
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold">Latest Feedback</h2>
                            {recentFeedback ? (
                                <div className="text-left mt-4">
                                    <p className="font-bold">Rating: {recentFeedback.rating}/5</p>
                                    <p className={recentFeedback.feedback ? "italic" : ""}>
                                        {recentFeedback.feedback ? `"${recentFeedback.feedback}"` : "No feedback provided"}
                                    </p>

                                </div>
                            ) : (
                                <p>No feedback available</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StaffQueue;
