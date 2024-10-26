function Navbar() {
    return (
        <div className="w-full h-14 flex justify-around items-center bg-white shadow">
            <h1 className="font-bold">LOGO</h1>
            <div className="flex gap-16 font-semibold">
                <a href="./booking">Booking</a>
                <a>Queue</a>
                <a href="./enquiries">Enquiry Portal</a>
            </div>
        </div>
    )
}

export default Navbar
