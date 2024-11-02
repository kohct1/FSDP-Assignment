import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";

function BookingDate() {
    const [userId, setUserId] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<number>(1);
    const [bookings, setBookings] = useState<any>({});
    const [hasBookings, setHasBookings] = useState<boolean>(false);
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
        await fetch(`http://localhost:5050/bookings/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                date: selectedDate,
                time: time,
                slot: slot,
            })
        });
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
    
        if (result.bookings.length > 0) setHasBookings(true);
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
                    <div className="w-3/5 flex flex-col border-b-2 py-8 gap-2">
                        <div className="text-2xl text-start font-semibold">You are rescheduling your booking for:</div>
                        <div className="text-start">Wed, Nov 5 2024, 10.20-10.40</div>
                    </div>
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
                    <div className="w-full h-1/6 flex items-center text-xl font-semibold px-8">Available time slots</div>
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
                                    <div className="border-b-2 text-xl font-semibold pb-2">{time}am</div>
                                    <div>
                                        {slots.map((slot: number) => {
                                            if (slots.includes(slot + 2 - 1)) {
                                                return (
                                                    <button className="w-1/4 bg-red-600 rounded text-white font-semibold m-4 px-3 py-2" onClick={() => createUserBooking(time, [slot, slot + 2 - 1])}>{`${time}.${(slot - 1) * 10} - ${time}.${(slot + 2 - 1) * 10}`}</button>
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
