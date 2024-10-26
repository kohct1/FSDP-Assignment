function Navbar() {
    return (
        <div className="w-full h-20 flex justify-around items-center bg-white">
            <div className="text-red-600 text-2xl font-bold">OCBC</div>
            <div className="flex gap-16 font-semibold">
                <a>Booking</a>
                <a>Queue</a>
                <a>Enquiry Portal</a>
            </div>
        </div>
    )
}

export default Navbar
