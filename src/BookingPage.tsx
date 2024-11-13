import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from "./components/Navbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    salutation: '',
    name: '',
    phoneNumber: '',
    email: '',
    reason: '',
  });
  const [userId, setUserId] = useState<string>("");
  const [newReason, setNewReason] = useState<string>("");
  const [hasBookings, setHasBookings] = useState<boolean>(false);
  const [userBookings, setUserBookings] = useState<any>({});
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [bookings, setBookings] = useState<any>({});
  const [category, setCategory] = useState<string>("OCBC Mobile App");

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const currentDate: Date = new Date();
  const months: string[] = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Simulating fetching user data (replace with real data fetch)
  useEffect(() => {
    const fetchUserData = async () => {
      // Replace this object with an actual data fetch
      const userData = {
        salutation: 'Mr',
        name: 'John Doe',
        phoneNumber: '1234567890',
        email: 'johndoe@example.com',
      };
      
      setFormData({
        ...formData,
        ...userData,
      });
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    getUser();
    getAllBookings();
    getRole();
  }, []);

  useEffect(() => {
    if (userId !== "") {
        getUserBookings();
    }
  }, [userId]);

  async function getUserBookings(): Promise<void> {
    const response = await fetch(`http://localhost:5050/userBookings/${userId}/`);
    const result = await response.json();

    if (result.bookings.length > 0) {
        setHasBookings(true);
        setUserBookings(result.bookings);
        setNewReason(result.bookings[0].reason);
    }
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
  }

  async function getAllBookings(): Promise<void> {
    const response = await fetch(`http://localhost:5050/allBookings/`);
    const result = await response.json();

    setBookings(result.bookings.filter((booking: any) => {
      if (Number(booking.date) === currentDate.getDate()) return booking;
    }));
  }

  async function deleteBooking(): Promise<void> {
    await fetch(`http://localhost:5050/bookings/${userId}/`, {
        method: "DELETE"
    });

    location.reload();
  }

  async function editBooking(): Promise<void> {
    await fetch(`http://localhost:5050/bookingsReason/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: userId,
            reason: newReason
        })
    });
  }

  async function getRole(): Promise<void> {
    const response = await fetch(`http://localhost:5050/role/`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          token: localStorage.getItem("token")
      })
    });
    
    const result = await response.json();

    if (result.role === "Staff") {
      setIsStaff(true);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    navigate('/homepage'); // Redirect to the homepage
  };

  const handleCancel = () => {
    setShowModal(false); // Close the modal and allow editing
  };

  if (isStaff) {
    if (bookings.length === 0) {
      return (
        <div className="w-full h-screen">
            <Navbar />
            <div className="w-full h-full flex flex-col items-center">
                <div className="w-1/2 h-1/2 flex flex-col items-center p-8 gap-8">
                    <div className="w-full border-b-2 py-8">
                        <h1 className="w-full text-2xl text-start font-semibold">Bookings</h1>
                    </div>
                    <div className="h-full flex justify-center items-center">
                      <h1 className="text-xl font-semibold">No bookings left for today</h1>
                    </div>
                </div>
            </div>
        </div>
      );
    }

    return (
      <div className="w-full h-screen">
          <Navbar />
          <div className="w-full h-full flex flex-col items-center">
              <div className="w-1/2 h-1/2 flex flex-col items-center p-8 gap-8">
                  <div className="w-full border-b-2 py-8">
                      <h1 className="w-full text-2xl text-start font-semibold">Bookings</h1>
                  </div>
                  {Object.values(bookings).map((booking: any) => {
                    if (Number(booking.date) === currentDate.getDate()) {
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
                        <div className="w-full flex flex-col justify-center border-2 rounded p-4 gap-4">
                          <h1 className="text-lg font-semibold">{months[currentDate.getMonth()]} {booking.date} {currentDate.getFullYear()}, {`${time1}.${slot1} - ${time2}.${slot2}`}</h1>
                          <label className="block text-left text-gray-700 font-semibold">
                            Booking category
                          </label>
                          <h1 className="text-sm">{booking.category}</h1>
                          <label className="block text-left text-gray-700 font-semibold">
                            Booking reason
                          </label>
                          <h1>{booking.reason}</h1>
                          <div className="flex justify-end items-center gap-8">
                            <motion.button className="bg-red-600 text-sm text-white rounded px-4 py-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/webcall")}>Call</motion.button>
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
          </div>
      </div>
    );
  }

  if (hasBookings) {
    let time1: number = userBookings[0].time;
    let time2: number = userBookings[0].time;
    let slot1: string = String((userBookings[0].slot[0] - 1) * 10);
    let slot2: string = String((userBookings[0].slot[1]) * 10);

    if (slot1 === "0" || slot1 === "60") slot1 = "00";
    if (slot2 === "0" || slot2 === "60") {
        slot2 = "00";
        
        if (time2 === 12) {
            time2 = 1;
        } else {
            time2 += 1;
        }
    }

    if (Number(userBookings[0].date) === currentDate.getDate()) {
      return (
        <div className="w-full h-screen">
            <Navbar />
            <div className="w-full h-full flex flex-col items-center">
                <div className="w-1/2 h-1/2 flex flex-col items-center p-8 gap-8">
                    <div className="w-full border-b-2 py-8">
                        <h1 className="w-full text-2xl text-start font-semibold">Bookings</h1>
                    </div>
                    <div className="w-full flex flex-col justify-center border-2 rounded p-4 gap-4">
                      <div className="flex justify-between">
                        <h1 className="text-lg font-semibold">{months[currentDate.getMonth()]} {userBookings[0].date} {currentDate.getFullYear()}, {`${time1}.${slot1} - ${time2}.${slot2}`}</h1>
                        <button onClick={deleteBooking}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path className="fill-red-600" d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h1 className="font-semibold">Booking description</h1>
                        <textarea className="w-full h-3/4 border-2 rounded resize-none p-2" value={newReason} onChange={(e) => setNewReason(e.target.value)}></textarea>
                      </div>
                      <div className="flex justify-end items-center gap-8">
                        <motion.button className="bg-red-600 text-sm text-white rounded px-4 py-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/callpage")}>Call</motion.button>
                      </div>
                    </div>
                </div>
            </div>
        </div>
      );
    }

    return (
      <div className="w-full h-screen">
          <Navbar />
          <div className="w-full h-full flex flex-col items-center">
              <div className="w-1/2 h-1/2 flex flex-col items-center p-8 gap-8">
                  <div className="w-full border-b-2 py-8">
                      <h1 className="w-full text-2xl text-start font-semibold">Bookings</h1>
                  </div>
                  <div className="w-full flex flex-col justify-center border-2 rounded p-4 gap-4">
                    <div className="flex justify-between">
                      <h1 className="text-lg font-semibold">{months[currentDate.getMonth()]} {userBookings[0].date} {currentDate.getFullYear()}, {`${time1}.${slot1} - ${time2}.${slot2}`}</h1>
                      <Dialog>
                        <DialogTrigger><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path className="fill-red-600" d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                              This will delete your booking and you will lose your slot. You can create a new booking afterwards.
                            </DialogDescription>
                            <DialogFooter>
                              <motion.button className="bg-red-600 text-sm text-white rounded px-4 py-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={deleteBooking}>Delete</motion.button>
                            </DialogFooter>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h1 className="font-semibold">Booking description</h1>
                      <textarea className="w-full h-3/4 border-2 rounded resize-none p-2" value={newReason} onChange={(e) => setNewReason(e.target.value)}></textarea>
                    </div>
                    <div className="flex justify-end items-center gap-8">
                      <Link className="text-sm" to="/booking-date" state={{ category: userBookings[0].category}}>Reschedule booking</Link>
                      <motion.button className="bg-red-600 text-sm text-white rounded px-4 py-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={editBooking}>Edit</motion.button>
                    </div>
                  </div>
              </div>
          </div>
      </div>
  );
  }

  return (
    <div className="bg-gray-100">
      <Navbar />

      <div className="flex justify-center items-center py-12">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Make a Booking</h1>
          <p className="text-gray-600 text-sm mb-8">
            For urgent matters, please call us directly at <span className="font-semibold">6535 7677</span>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-left mb-2">
                  Booking category <span className="text-red-500">*</span>
                </label>
                <select id="types" name="types" className="p-2 border mb-4 w-full rounded" required onChange={(e) => setCategory(e.target.value)}>
                    <option value="OCBC Mobile App">OCBC Mobile App</option>
                    <option value="Loans">Loans/Collections</option>
                    <option value="Banking Card">Credit/Debit Card</option>
                    <option value="Premier Services">Premier Services</option>
                    <option value="Investments">Investment/Securities</option>
                    <option value="Account">Bank Account</option>
                    <option value="Other">Other</option>
                </select>
                <label className="block text-left mb-2">
                  Reason for booking <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className="block w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  placeholder="Enter the reason for your booking"
                  maxLength={500}
                  rows={5}
                />
                <p className="text-sm text-left mt-1">Characters left: {500 - formData.reason.length}</p>
              </div>

              <div className="mt-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {formData.reason !== "" ? <Link
                    type="submit"
                    className="w-full flex justify-center items-center bg-red-500 text-white py-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    to="/booking-date"
                    state={{ reason: formData.reason, category: category }}
                  >
                    Continue
                  </Link> :
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center bg-red-500 text-white py-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Continue
                  </button>}
                </motion.div>
              </div>
            </div>
          </form>
        </div>
      </div>
    {/* Confirmation Modal */}
    {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Your Details</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to submit this information?</p>
            <div className="flex justify-end space-x-4">
              <motion.button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                No
              </motion.button>
              <motion.button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                Yes
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div> 
  );
};

export default BookingForm;
