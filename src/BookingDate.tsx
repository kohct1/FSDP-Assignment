import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import BookingDateHeader from "./components/BookingDateHeader";

function BookingDate() {
    const [userId, setUserId] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<number>(1);
    const [bookings, setBookings] = useState<any>({});
    const [hasBookings, setHasBookings] = useState<boolean>(false);
    const [userBookings, setUserBookings] = useState<any>({});
    const { state } = useLocation();
    const navigate = useNavigate();
    const currentDate: Date = new Date();
    const days: number = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const months: string[] = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    const times: number[] = [10, 11, 12, 1, 2, 3, 4, 5, 6];

    async function getBookings(): Promise<void> {
        const response = await fetch(`http://localhost:5050/bookings/${selectedDate}/`);
        const result = await response.json();

        setBookings(result.bookings);
    }

    async function createBooking(time: number, slot: number[]): Promise<void> {
        await fetch(`http://localhost:5050/bookings/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                date: String(selectedDate),
                time: time,
                slot: slot,
                userId: userId,
                reason: state.reason
            })
        });

        navigate("/homepage");
    }
    
    async function updateBooking(time: number, slot: number[]): Promise<void> {
        console.log("Here");
        await fetch(`http://localhost:5050/bookings/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                date: String(selectedDate),
                time: time,
                slot: slot,
            })
        });

        navigate("/homepage");
    }

    async function getUser(): Promise<void> {
        const response = await fetch(`http://localhost:5050/decode/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: localStorage.getItem("token")
            })
        });

        const result = await response.json();

        setUserId(result.userId);
    }

    async function getUserBookings(): Promise<void> {
        const response = await fetch(`http://localhost:5050/userBookings/${userId}/`);
        const result = await response.json();
    
        if (result.bookings.length > 0) {
            setHasBookings(true);
            setUserBookings(result.bookings);
        }
    }

    async function createUserBooking(time: number, slot: number[]): Promise<void> {
        if (hasBookings) {
            updateBooking(time, slot);
        } else {
            createBooking(time, slot);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        getUserBookings();
    }, [userId]);

    useEffect(() => {
        getBookings();
    }, [selectedDate]);

    return (
        <div className="w-full h-screen flex flex-col items-center">
            <Navbar />
            <div className="w-full h-full flex">
                <div className="w-3/5 h-full flex flex-col items-center border-r-2 gap-16">
                    <BookingDateHeader hasBookings={hasBookings} booking={userBookings[0]} month={months[currentDate.getMonth()]} year={String(currentDate.getFullYear())} />
                    <div className="w-3/5 flex flex-col justify-center items-center gap-8">
                        <h1 className="text-xl font-semibold">{`${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`}</h1>
                        <div className="flex flex-col justify-center items-center gap-4">
                            {Array(days).fill(0).map((_: number, index: number) => {
                                if (index !== 0 && index % 7 === 0) {
                                    return (
                                        <div className="w-full flex gap-8">
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
                                            <div className="w-full flex gap-8">
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
                    </div>
                <div className="w-2/5 h-full bg-slate-100 overflow-scroll">
                    <div className="w-full h-1/6 flex flex-col justify-center items-start px-8">
                        <h1 className="text-2xl font-semibold">Available time slots for:</h1>
                        <h1 className="text-xl">{months[currentDate.getMonth()]} {selectedDate}</h1>
                    </div>
                    <div className="flex flex-col bg-white border-y-2 p-8 gap-8">
                        {times.map((time: number) => {
                            const filteredBookings: any = Object.values(bookings).filter((bookings: any) => bookings.time === time);
                            const slots: number[] = [1, 2, 3, 4, 5, 6];

                            filteredBookings.forEach((booking: any) => {
                                booking.slot.forEach((slot: number) => {
                                    slots.splice(slots.indexOf(slot), 1);
                                });
                            });

                            return (
                                <>
                                    <div className="border-b-2 text-xl font-semibold pb-2">{time < 10 || time === 12 ? `${time}pm` : `${time}am`}</div>
                                    <div>
                                        {slots.map((slot: number) => {
                                            let time1: number = time;
                                            let time2: number = time;
                                            let slot1: string = String((slot - 1) * 10);
                                            let slot2: string = String((slot + 2 - 1) * 10);

                                            if (slot1 === "0" || slot1 === "60") slot1 = "00";
                                            if (slot2 === "0" || slot2 === "60") {
                                                slot2 = "00";
                                                
                                                if (time2 === 12) {
                                                    time2 = 1;
                                                } else {
                                                    time2 += 1;
                                                }
                                            }


                                            if (slots.includes(slot + 2 - 1)) {
                                                return (
                                                    <motion.button className="w-1/4 bg-red-600 rounded text-white font-semibold m-4 px-3 py-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => createUserBooking(time, [slot, slot + 2 - 1])}>{`${time1}.${slot1} - ${time2}.${slot2}`}</motion.button>
                                                );
                                            }
                                        })}
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingDate
