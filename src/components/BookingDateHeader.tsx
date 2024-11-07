function BookingDateHeader({ hasBookings, booking, month, year }: { hasBookings: boolean, booking: any, month: string, year: string }) {
    if (hasBookings) {
        let time1: number = booking.time;
        let time2: number = booking.time;
        let slot1: string = String((booking.slot[0] - 1) * 10);
        let slot2: string = String((booking.slot[1]) * 10);

        if (slot1 === "0" || slot1 === "60") slot1 = "00";
        if (slot2 === "0" || slot2 === "60") {
            slot2 = "00";
            
            if (time2 === 12) {
                time2 = 1;
            } else {
                time2 += 1;
            }
        }

        return (
            <div className="w-3/5 flex flex-col border-b-2 py-8 gap-2">
                <div className="text-2xl text-start font-semibold">You are rescheduling your booking for:</div>
                <div className="text-start">{month} {booking.date} {year}, {`${time1}.${slot1} - ${time2}.${slot2}`}</div>
            </div>
        );
    }

    return (
        <div className="w-3/5 flex flex-col border-b-2 py-8 gap-2">
            <div className="text-2xl text-start font-semibold">Schedule a booking with us</div>
            <div className="text-start">Bookings help us leave the live call line for more urgent calls</div>
        </div>
    );
}

export default BookingDateHeader
