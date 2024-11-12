import { useState, useEffect, useCallback } from "react";
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
    const [selectedTime, setSelectedTime] = useState<number>(10);
    const [selectedSlot, setSelectedSlot] = useState<number[]>([]);
    const [displayTime, setDisplayTime] = useState<string[]>([]);
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
                reason: state.reason,
                category: state.category
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

    function setSelectedTimeAndSlot(time: number, slot: number[]): void {
        setSelectedTime(time);
        setSelectedSlot(slot);
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

    useEffect(() => {
        let time1: number = selectedTime;
        let time2: number = selectedTime;
        let slot1: string = String((selectedSlot[0] - 1) * 10);
        let slot2: string = String((selectedSlot[1]) * 10);

        if (slot1 === "0" || slot1 === "60") slot1 = "00";
        if (slot2 === "0" || slot2 === "60") {
            slot2 = "00";
            
            if (time2 === 12) {
                time2 = 1;
            } else {
                time2 += 1;
            }
        }

        let displayTime1: string = `${time1}.${slot1}`;
        let displayTime2: string = `${time2}.${slot2}`;

        setDisplayTime([displayTime1, displayTime2]);
    }, [selectedSlot]);

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
                                        <div key={index} className="w-full flex gap-8">
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index - 6)}>{index - 6 === selectedDate ? <div className="w-full h-full flex justify-center items-center bg-slate-100 rounded">{index - 6}</div> : index - 6}</div>
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index - 5)}>{index - 5 === selectedDate ? <div className="w-full h-full flex justify-center items-center bg-slate-100 rounded">{index - 5}</div> : index - 5}</div>
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index - 4)}>{index - 4 === selectedDate ? <div className="w-full h-full flex justify-center items-center bg-slate-100 rounded">{index - 4}</div> : index - 4}</div>
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index - 3)}>{index - 3 === selectedDate ? <div className="w-full h-full flex justify-center items-center bg-slate-100 rounded">{index - 3}</div> : index - 3}</div>
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index - 2)}>{index - 2 === selectedDate ? <div className="w-full h-full flex justify-center items-center bg-slate-100 rounded">{index - 2}</div> : index - 2}</div>
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index - 1)}>{index - 1 === selectedDate ? <div className="w-full h-full flex justify-center items-center bg-slate-100 rounded">{index - 1}</div> : index - 1}</div>
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index)}>{index === selectedDate ? <div className="w-full h-full flex justify-center items-center bg-slate-100 rounded">{index}</div> : index}</div>
                                        </div>
                                    );
                                }

                                if (index === days - 1) {
                                    if (index + 1 === 30) {
                                        return (
                                            <div key={index} className="w-full flex gap-8">
                                                <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index)}>{index === selectedDate ? <div className="w-full h-full flex justify-center items-center bg-slate-100 rounded">{index}</div> : index}</div>
                                                <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index + 1)}>{index + 1 === selectedDate ? <div className="w-full h-full flex justify-center items-center bg-slate-100 rounded">{index + 1}</div> : index + 1}</div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={index} className="w-full flex gap-8">
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index - 1)}>{index - 1}</div>
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index)}>{index}</div>
                                            <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(index + 1)}>{index + 1}</div>
                                        </div>
                                    );
                                }
                            })}
                        </div>  
                    </div>
                    <div className="w-full flex flex-col items-center gap-2">
                        <h1>{selectedSlot.length === 0 ? "Select a booking date and time" : `Book for: ${months[currentDate.getMonth()]} ${selectedDate} ${String(currentDate.getFullYear())}, ${displayTime[0]} - ${displayTime[1]}`}</h1>
                        <motion.button className="w-1/4 bg-red-600 rounded text-white font-semibold m-4 px-3 py-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => createUserBooking(selectedTime, selectedSlot)}>Confirm</motion.button>
                    </div>
                </div>
                <div className="w-2/5 h-full bg-slate-100 overflow-scroll">
                    <div className="w-full h-1/6 flex flex-col justify-center items-start px-8">
                        <h1 className="text-2xl font-semibold">Available time slots for:</h1>
                        <h1 className="text-xl">{months[currentDate.getMonth()]} {selectedDate}</h1>
                    </div>
                    <div className="flex flex-col bg-white border-y-2 p-8 gap-8">
                        {times.map((time: number, index: number) => {
                            const filteredBookings: any = Object.values(bookings).filter((bookings: any) => bookings.time === time);
                            const slots: number[] = [1, 2, 3, 4, 5, 6];

                            filteredBookings.forEach((booking: any) => {
                                booking.slot.forEach((slot: number) => {
                                    slots.splice(slots.indexOf(slot), 1);
                                });
                            });

                            return (
                                <div key={index} className="flex flex-col gap-4">
                                    <div className="border-b-2 text-xl font-semibold pb-2">{time}am</div>
                                    <div>
                                        {slots.map((slot: number, index: number) => {
                                            let suggestedSlots: number = 1;

                                            if (state.category === "OCBC Mobile App") {
                                                suggestedSlots = 2;
                                            } else if (state.category === "Loans/Collections") {
                                                suggestedSlots = 1;
                                            } else if (state.category === "Credit/Debit Card") {
                                                suggestedSlots = 1;
                                            } else if (state.category === "Premier Services") {
                                                suggestedSlots = 2;
                                            } else if (state.category === "Investments/Securities") {
                                                suggestedSlots = 2;
                                            } else if (state.category === "Bank Account") {
                                                suggestedSlots = 1;
                                            } else if (state.category === "Other") {
                                                suggestedSlots = 3;
                                            }

                                            let time1: number = time;
                                            let time2: number = time;
                                            let slot1: string = String((slot - 1) * 10);
                                            let slot2: string = String((slot + suggestedSlots - 1) * 10);

                                            if (slot1 === "0" || slot1 === "60") slot1 = "00";
                                            if (slot2 === "0" || slot2 === "60") {
                                                slot2 = "00";
                                                
                                                if (time2 === 12) {
                                                    time2 = 1;
                                                } else {
                                                    time2 += 1;
                                                }
                                            }

                                            if (slots.includes(slot + suggestedSlots - 1)) {
                                                if (time === selectedTime && selectedSlot[0] === slot && selectedSlot[1] === slot + suggestedSlots - 1) {
                                                    return (
                                                        <motion.button key={index} className="w-1/4 bg-red-700 rounded text-white font-semibold m-4 px-3 py-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{`${time1}.${slot1} - ${time2}.${slot2}`}</motion.button>
                                                    );
                                                }

                                                return (
                                                    <motion.button key={index} className="w-1/4 bg-red-600 rounded text-white font-semibold m-4 px-3 py-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedTimeAndSlot(time, [slot, slot + suggestedSlots - 1])}>{`${time1}.${slot1} - ${time2}.${slot2}`}</motion.button>
                                                );
                                            }
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingDate
