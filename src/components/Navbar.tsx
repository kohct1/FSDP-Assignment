function Navbar() {
    return (
        <div className="relative z-20 w-full border-b border-gray-300 p-4 bg-white bg-opacity-100 pl-20 pr-20">
                <div className="flex justify-between items-center w-full">
                    <img
                        src='/src/OCBC_Bank_logo.png' // OCBC logo link
                        alt="OCBC Logo"
                        className="h-12"
                    />
                    <div className="flex sm:space-x-16 space-x-4 sm:mr-10 mr-0">
                        <a href="/bookingpage" className="text-gray-600 font-semibold text-xs sm:text-base">Booking</a>
                        <a href="/ticketing" className="text-gray-600 font-semibold text-xs sm:text-base">Queue</a>
                        <a href="#enquiries" className="text-gray-600 font-semibold text-xs sm:text-base">Enquiry Portal</a>
                    </div>
                </div>
            </div>
    )
}

export default Navbar
