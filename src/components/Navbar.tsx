function Navbar() {
    return (
        <div className="w-full h-14 flex justify-around items-center bg-white">
            <h1 className="font-bold">LOGO</h1>
            <div className="flex gap-16 font-semibold">
                <a>Booking</a>
                <a>Queue</a>
                <a>Enquiry Portal</a>
            </div>
        </div>
    )
}

export default Navbar
