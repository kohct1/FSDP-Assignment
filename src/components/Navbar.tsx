function Navbar() {
    return (
        <div className="relative z-20 w-full border-b border-gray-300 p-4 bg-white bg-opacity-100 pl-20 pr-20">
                <div className="flex justify-between items-center w-full">
                    <img
                        src='/src/OCBC_Bank_logo.png' // OCBC logo link
                        alt="OCBC Logo"
                        className="h-12"
                    />
                    <div className="flex space-x-10">
                        <a href="#booking" className="text-gray-600 font-semibold">Booking</a>
                        <a href="#queue" className="text-gray-600 font-semibold">Queue</a>
                        <a href="#enquiry" className="text-gray-600 font-semibold">Enquiry Portal</a>
                    </div>
                </div>
            </div>
    )
}

export default Navbar
