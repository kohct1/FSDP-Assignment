import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import Navbar from "./components/Navbar";

function BookingTime() {
    const [bookings, setBookings] = useState<any>({});
    const [slotLength, setSlotLength] = useState<number>(2);
    const { state } = useLocation();
    const navigate = useNavigate();
    const times: number[] = [10, 11, 12, 1, 2, 3, 4, 5, 6];
    const slots: number[] = [1, 2, 3, 4, 5, 6];

    async function getBookings(): Promise<any> {
        const response = await fetch(`http://localhost:5050/bookings/${state.selectedDate}/`);
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
                date: String(state.selectedDate),
                time: time,
                slot: slot
            })
        });

        navigate("/home");
    }

    useEffect(() => {
        getBookings();
    }, []);

    return (
        <div className="w-full h-screen flex flex-col items-center">
            <Navbar />
            <div className="w-1/2 h-full flex flex-col justify-center items-center gap-8">
                <div className="w-full flex flex-col gap-4">
                    <h1 className="text-5xl font-semibold">Select a time</h1>
                    <h1 className="text-xl">Choose the time that you want to give us a call</h1>
                </div>
                <div className="w-full h-1/2 flex overflow-scroll gap-4">
                    <div className="w-full flex flex-col items-center border-2 rounded-md">
                        {times.map((time: number) => {
                            const filteredBookings: any = Object.values(bookings).filter((booking: any) => booking.time === time);

                            if (filteredBookings.length === 0) {
                                const slotsCopy: number[] = [...slots];

                                return (
                                    <div className="w-full flex bg-slate-100 border-b-2">
                                        <h1 className="min-w-24 border-r-2 text-xl text-center font-semibold p-8">{time}</h1>
                                        {slotsCopy.map((slot: number) => {
                                            if (slotsCopy.includes(slot + slotLength - 1)) {
                                                return (
                                                    <button className="flex justify-center items-center bg-red-600 rounded text-white font-semibold m-6 px-3 py-2" onClick={() => createBooking(time, [slot, slot + slotLength - 1])}>{`${time}.${(slot - 1) * 10} - ${time}.${(slot + slotLength - 1) * 10}`}</button>
                                                );
                                            }
                                        })}
                                    </div>
                                );
                            }

                            return (
                                <>
                                    {filteredBookings.map((booking: any) => {
                                        const slotsCopy: number[] = [...slots];
                                        
                                        booking.slot.forEach((slot: number) => {
                                            slotsCopy.splice(slotsCopy.indexOf(slot), 1);
                                        });
            
                                        return (
                                            <div className="w-full flex bg-slate-100 border-b-2">
                                                <h1 className="min-w-24 border-r-2 text-xl text-center font-semibold p-8">{time}</h1>
                                                {slotsCopy.map((slot: number) => {
                                                    if (slotsCopy.includes(slot + slotLength - 1)) {
                                                        return (
                                                            <button className="flex justify-center items-center bg-red-600 rounded text-white font-semibold m-6 px-3 py-2" onClick={() => createBooking(time, [slot, slot + slotLength - 1])}>{`${booking.time}.${(slot - 1) * 10} - ${booking.time}.${(slot + slotLength - 1) * 10}`}</button>
                                                        );
                                                    }
                                                })}
                                            </div>
                                        );
                                    })}
                                </>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingTime
