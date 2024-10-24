import React from 'react';

const ticketing = () => {
    // Dynamic data - You can change these values as needed
    const queueCount = 30;
    const waitingTime = 3;  // in hours
    const lastUpdatedTime = "8:17:30";

    return (
        <div className="relative flex flex-col min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/src/ticketing_bg.jpg')" }}>
            
            {/* Overlay for background fade */}
            <div className="absolute inset-0 bg-white opacity-50"></div>

            {/* Header positioned over the background */}
            <div className="relative z-20 w-full border-b border-gray-300 p-4 bg-white bg-opacity-100 pl-20 pr-20">
                <div className="flex justify-between items-center w-full">
                    <img
                        src='/src/OCBC_Bank_logo.png' // OCBC logo link
                        alt="OCBC Logo"
                        className="h-12"
                    />
                    <div className="flex space-x-10">
                        <a href="#booking" className="text-gray-600 font-semibold">Booking</a>
                        <a href="#queue" className="text-gray-600 font-semibold">Queue</a>
                        <a href="#enquiry" className="text-gray-600 font-semibold">Enquiry Portal</a>
                    </div>
                </div>
            </div>

            {/* Main Content (Queue box) */}
            <div className="relative z-10 flex justify-center items-center flex-grow">
                <div className="bg-white shadow-lg rounded-lg p-10 text-center max-w-md opacity-100">
                    <h2 className="text-lg font-medium">There are currently</h2>
                    <h1 className="text-6xl font-bold my-4">{queueCount}</h1>
                    <p className="text-lg">People in the Queue</p>

                    <form action="">
                        <button className="bg-red-600 text-white text-lg font-semibold px-6 py-3 rounded mt-8">
                            Join the Queue
                        </button>
                    </form>

                    <p className="mt-4 text-lg">
                        Estimated Waiting Time: <strong>{waitingTime} hours</strong>
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Status Last Updated: {lastUpdatedTime}
                    </p>

                    <p className="mt-4 text-sm text-gray-700">
                        If it is not an urgent matter, please <a href="#book" className="text-blue-600 underline">book a slot</a> instead.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ticketing;
