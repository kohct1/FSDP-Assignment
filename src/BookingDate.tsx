import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

function BookingDate() {
    const [selectedDate, setSelectedDate] = useState<number>(1);
    const { state } = useLocation();
    const currentDate: Date = new Date();
    const days: number = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const months: string[] = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="w-full h-screen flex flex-col items-center">
            <Navbar />
            <div className="w-fit h-full flex flex-col justify-center items-center gap-8">
                <div className="w-full flex flex-col gap-4">
                    <h1 className="text-5xl font-semibold">Select a date</h1>
                    <h1 className="text-xl">Choose the date that you want to give us a call</h1>
                </div>
                <div className="w-fit h-fit flex gap-4">
                    <div className="w-2/3 flex flex-col items-center bg-slate-100 border-2 rounded-md p-8 gap-8">
                        <h1 className="text-xl font-semibold">{`${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`}</h1>
                        <div className="w-full h-full flex flex-col justify-center items-center gap-4">
                            {Array(days).fill(0).map((_: number, index: number) => {
                                if (index !== 0 && index % 7 === 0) {
                                    return (
                                        <div className="w-full flex justify-center gap-8">
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index - 6)}>{index - 6}</div>
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index - 5)}>{index - 5}</div>
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index - 4)}>{index - 4}</div>
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index - 3)}>{index - 3}</div>
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index - 2)}>{index - 2}</div>
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index - 1)}>{index - 1}</div>
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index)}>{index}</div>
                                        </div>
                                    );
                                }

                                if (index === days - 1) {
                                    if (index + 1 === 30) {
                                        return (
                                            <div className="w-full flex ml-8 gap-8">
                                                <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index)}>{index}</div>
                                                <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index - 1)}>{index + 1}</div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="w-full flex gap-8">
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index - 1)}>{index - 1}</div>
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index)}>{index}</div>
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index + 1)}>{index + 1}</div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                    <div className="w-1/3 flex flex-col items-center relative bg-slate-100 border-2 rounded-md text-red-600">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-5xl font-semibold pt-8">LOW</h1>
                            <h1 className="text-xl font-semibold">Number of bookings left</h1>
                        </div>
                        <h1 className="h-1/2 text-[8rem] text-slate-300 font-semibold bottom-1/4">{selectedDate}</h1>
                        <div className="w-full h-full absolute flex justify-center items-end pb-8 gap-4">
                            <div className="w-[12%] h-1/5 bg-red-600 rounded"></div>
                            <div className="w-[12%] h-1/3 bg-red-600 rounded"></div>
                            <div className="w-[12%] h-1/4 bg-red-600 rounded"></div>
                            <div className="w-[12%] h-1/6 bg-red-600 rounded"></div>
                            <div className="w-[12%] h-1/4 bg-red-600 rounded"></div>
                        </div>
                    </div>
                </div>
                <Link to="/booking-time" state={{ selectedDate: selectedDate, reason: state.reason }}>Next</Link>
            </div>
        </div>
    );
}

export default BookingDate
