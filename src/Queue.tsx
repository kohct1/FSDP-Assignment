import Navbar from "./components/Navbar";
import { Link } from "react-router-dom";

const Queue = () => {
    // Dynamic data for queue status
    const queueAhead = 30;
    const waitingTime = 2; // in hours
    const lastUpdated = "9:17:46";

    return (
        <div className="relative flex flex-col min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/src/ticketing_bg.jpg')" }}>
            
            {/* Overlay for background fade */}
            <div className="absolute inset-0 bg-white opacity-50"></div>

            {/* Header positioned over the background */}
            <Navbar />

            {/* Main Content */}
            <main className="relative z-10 flex justify-center items-center flex-grow">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center opacity-100">
                    {/* Queue Info */}
                    <h2 className="text-lg font-semibold">You Are Now in The Queue</h2>
                    <h1 className="text-6xl font-bold my-4">{queueAhead}</h1>
                    <p className="text-lg text-black-700">People Ahead of You</p>

                    {/* Progress Bar */}
                    <div className="mt-6 mb-8">
                        <div className="relative w-full h-2 bg-gray-300 rounded-full">
                            <div
                                className="absolute top-0 h-2 bg-red-600 rounded-full"
                                style={{ width: `${(queueAhead / 100) * 100}%` }} // Adjust the width based on the queue position
                            ></div>
                            <div
                                className="absolute top-1 left-0 w-4 h-4 bg-red-600 rounded-full transform -translate-y-1/2"
                                style={{ left: `${((queueAhead-3)/ 100) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Waiting Time */}
                    <p className="text-lg">
                        Estimated Waiting Time: <strong>{waitingTime} hours</strong>
                    </p>

                    {/* Last Updated Time */}
                    <p className="text-sm text-black-500 mt-2">
                        Status Last Updated: {lastUpdated}
                    </p>

                    {/* Booking Suggestion */}
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