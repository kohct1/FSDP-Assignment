import Navbar from "./components/Navbar";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const StaffQueue = () => {
    const [queueCount, setQueueCount] = useState(0);
    const [leftQueue, setLeftQueue] = useState(0);
    const [currentCall, setCurrentCall] = useState<number | null>(null);
    const [callStarted, setCallStarted] = useState(false); // Track if a call has started
    const [lastUpdatedTime, setLastUpdatedTime] = useState("");
    const [isProcessing, setIsProcessing] = useState(false); // For locking the button
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

    // Call the next person in the queue
    const callNextPerson = () => {
        if (queueCount - leftQueue > 0) {
            setCurrentCall(leftQueue + 1); // Set the currently serving call
            setCallStarted(true); // Indicate that a call has started
            setLastUpdatedTime(getCurrentTime());
        } else {
            alert("No one in the queue to call!");
        }
    };

    // Mark the current call as completed
    const completeCall = async () => {
        if (isProcessing) return; // Prevent overlapping requests
        if (currentCall !== null && callStarted) {
            setIsProcessing(true); // Lock further button presses

            try {
                const response = await fetch("http://localhost:5050/dequeue", {
                    method: "POST",
                });

                if (response.ok) {
                    await fetchQueueData(); // Refresh queue data immediately
                } else {
                    console.error("Failed to update left queue");
                }
            } catch (error) {
                console.error("Error completing the call:", error);
            } finally {
                setIsProcessing(false); // Unlock the button
            }
            //force values to be reset
            setLeftQueue((prev) => prev + 1); // Update the left queue count
            setCallStarted(false); // Ensure "Call Next Person" must be pressed again
            setCurrentCall(null); // Reset the current call after processing
        } else {
            alert("You need to call the next person before completing a call!");
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
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center opacity-100">
                    <h2 className="text-lg font-semibold">Staff Queue Management</h2>

                    <div className="my-6">
                        <h3 className="text-xl font-bold">Queue Status</h3>
                        <p className="text-lg">Total in Queue: {queueCount}</p>
                        <p className="text-lg">Left Queue: {leftQueue}</p>
                        <p className="text-lg">
                            Currently Serving: {currentCall !== null ? currentCall : "None"}
                        </p>
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

                        {/* Complete Call Button */}
                        <motion.button
                            className={`bg-white-600 text-red-600 text-lg font-semibold px-6 py-3 rounded mt-8 ${
                                !callStarted || isProcessing ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={completeCall}
                            disabled={!callStarted || isProcessing} // Disable unless conditions are met
                        >
                            Complete Current Call
                        </motion.button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StaffQueue;
