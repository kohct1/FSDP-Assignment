function BookingDateHeader({ hasBookings, booking, month, year }: { hasBookings: boolean, booking: any, month: string, year: string }) {
    if (hasBookings) {
        return (
            <div className="w-3/5 flex flex-col border-b-2 py-8 gap-2">
                <div className="text-2xl text-start font-semibold">You are rescheduling your booking for:</div>
                <div className="text-start">{month} {booking.date} {year}, {`${booking.time}.${(booking.slot[0] - 1) * 10} - ${booking.time}.${(booking.slot[0] + 2 - 1) * 10}`}</div>
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
