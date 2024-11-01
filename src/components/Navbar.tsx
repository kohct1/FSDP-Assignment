import { Link } from "react-router-dom"

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
                        <Link to="/bookingpage" className="text-gray-600 font-semibold">Booking</Link>
                        <Link to="/ticketing" className="text-gray-600 font-semibold">Queue</Link>
                        <Link to="/enquiries" className="text-gray-600 font-semibold">Enquiry Portal</Link>
                    </div>
                </div>
            </div>
    )
}

export default Navbar
