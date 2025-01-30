import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import BookingDateHeader from "./components/BookingDateHeader";
import Day from "./components/Day";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { gapi } from "gapi-script";
import { Button } from "./components/ui/button";

const clientId = "730772704554-stei2mnsmj852u34spa0fi870l07plmj.apps.googleusercontent.com";

function BookingDate() {
    const currentDate: Date = new Date();
    const [userId, setUserId] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [bookings, setBookings] = useState<any>({});
    const [hasBookings, setHasBookings] = useState<boolean>(false);
    const [userBookings, setUserBookings] = useState<any>({});
    const [selectedTime, setSelectedTime] = useState<number>(10);
    const [selectedSlot, setSelectedSlot] = useState<number[]>([]);
    const [displayTime, setDisplayTime] = useState<string[]>([]);
    const { state } = useLocation();
    const navigate = useNavigate();
    const days: number = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const [selectedDate, setSelectedDate] = useState<number>(currentDate.getDate() + 1 === days ? currentDate.getDate() : currentDate.getDate() + 1);
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
        setEmail(result.email);
    }

    async function sendEmail(): Promise<void> {
        await fetch("http://localhost:5050/bookingEmail/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                month: months[currentDate.getMonth()],
                day: String(selectedDate),
                times: displayTime
            })
        });
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
            sendEmail();
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

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: clientId,
                scope: 'https://www.googleapis.com/auth/calendar',
            });
        }

        gapi.load('client:auth2', start);
    }, []);

    function handleLogin() {
        const auth = gapi.auth2.getAuthInstance();
        auth.signIn().then(() => {
            console.log('User signed in');
            createEvent();
            navigate("/homepage");
        });
    };

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

    let time1: number = selectedTime;
    let time2: number = selectedTime;
    let slot1: string = String((selectedSlot[0] - 1) * 10);
    let slot2: string = String((selectedSlot[0] + suggestedSlots - 1) * 10);

    if (slot1 === "0" || slot1 === "60") slot1 = "00";
    if (slot2 === "0" || slot2 === "60") {
        slot2 = "00";
        
        if (time2 === 12) {
            time2 = 1;
        } else {
            time2 += 1;
        }
    }

    async function createEvent() {
        const event = {
            summary: 'OCBC Online Meeting',
            location: 'Online',
            description: state.reason,
            start: {
                dateTime: `${String(currentDate.getFullYear())}-${currentDate.getMonth() + 1}-${selectedDate}T${time1}:${slot1}:00+08:00`,
                timeZone: 'Asia/Singapore',
            },
            end: {
                dateTime: `${String(currentDate.getFullYear())}-${currentDate.getMonth() + 1}-${selectedDate}T${time2}:${slot2}:00+08:00`,
                timeZone: 'Asia/Singapore',
            },
        };
      
        const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
      
        try {
            const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                method: 'POST',
                headers: {
                Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            });
      
            const data = await response.json();
            console.log('Event created: ', data);
            alert(`Event created: ${data.htmlLink}`);
        } catch (error) {
            console.error('Error creating event:', error);
        }
      };

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
                                            <Day day={index - 6} selectedDay={selectedDate} dayPast={index - 6 < currentDate.getDate()} setSelectedDate={setSelectedDate} />
                                            <Day day={index - 5} selectedDay={selectedDate} dayPast={index - 5 < currentDate.getDate()} setSelectedDate={setSelectedDate} />
                                            <Day day={index - 4} selectedDay={selectedDate} dayPast={index - 4 < currentDate.getDate()} setSelectedDate={setSelectedDate} />
                                            <Day day={index - 3} selectedDay={selectedDate} dayPast={index - 3 < currentDate.getDate()} setSelectedDate={setSelectedDate} />
                                            <Day day={index - 2} selectedDay={selectedDate} dayPast={index - 2 < currentDate.getDate()} setSelectedDate={setSelectedDate} />
                                            <Day day={index - 1} selectedDay={selectedDate} dayPast={index - 1 < currentDate.getDate()} setSelectedDate={setSelectedDate} />
                                            <Day day={index} selectedDay={selectedDate} dayPast={index < currentDate.getDate()} setSelectedDate={setSelectedDate} />
                                        </div>
                                    );
                                }

                                if (index === days - 1) {
                                    if (index + 1 === 30) {
                                        return (
                                            <div key={index} className="w-full flex gap-8">
                                                <Day day={index} selectedDay={selectedDate} dayPast={index < currentDate.getDate()} setSelectedDate={setSelectedDate} />
                                                <Day day={index + 1} selectedDay={selectedDate} dayPast={index + 1 < currentDate.getDate()} setSelectedDate={setSelectedDate} />
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={index} className="w-full flex gap-8">
                                            <Day day={index - 1} selectedDay={selectedDate} dayPast={index - 1 < currentDate.getDate()} setSelectedDate={setSelectedDate} />
                                            <Day day={index} selectedDay={selectedDate} dayPast={index < currentDate.getDate()} setSelectedDate={setSelectedDate} />
                                            <Day day={index + 1} selectedDay={selectedDate} dayPast={index + 1 < currentDate.getDate()} setSelectedDate={setSelectedDate} />
                                        </div>
                                    );
                                }
                            })}
                        </div>  
                    </div>
                    <div className="w-full flex flex-col items-center gap-2">
                        <h1>{selectedSlot.length === 0 ? "Select a booking date and time" : `Book for: ${months[currentDate.getMonth()]} ${selectedDate} ${String(currentDate.getFullYear())}, ${displayTime[0]} - ${displayTime[1]}`}</h1>
                        <Dialog>
                            <DialogTrigger className="w-full">
                                <motion.button className="w-1/4 bg-red-600 rounded text-white font-semibold m-4 px-3 py-2" disabled={selectedTime && selectedSlot.length > 0 ? false : true} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Confirm</motion.button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription className="pb-4">
                                        {`You are creating a booking for ${months[currentDate.getMonth()]} ${selectedDate} ${String(currentDate.getFullYear())}, ${displayTime[0]} - ${displayTime[1]}`}
                                    </DialogDescription>
                                    <DialogFooter>
                                        <Dialog>
                                            <DialogTrigger>
                                                <motion.button className="bg-red-600 text-sm text-white rounded px-4 py-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => createUserBooking(selectedTime, selectedSlot)}>Confirm</motion.button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-none">
                                                <DialogHeader>
                                                    <DialogTitle>Do you want to add this to your Google Calendar?</DialogTitle>
                                                    <DialogDescription className="pb-4">
                                                        We will add this booking to your Google Calendar
                                                    </DialogDescription>
                                                    <DialogFooter>
                                                        <motion.button className="text-s rounded px-4 py-2 hover:underline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/homepage")}>No Thanks</motion.button>
                                                        <motion.button className="bg-red-600 text-sm text-white rounded px-4 py-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleLogin()}>Confirm</motion.button>
                                                    </DialogFooter>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                    </DialogFooter>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
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
                                    <div className="border-b-2 text-xl font-semibold pb-2">{time < 10 || time === 12 ? `${time}pm` : `${time}am`}</div>
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
