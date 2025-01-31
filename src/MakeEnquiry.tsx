import Navbar from "./components/Navbar";
import { motion } from "framer-motion";
import { useState } from 'react';
import { decodeToken } from "react-jwt";
import Joyride from "react-joyride";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";

function MakeEnquiry() {
    const [subjectLength, setSubjectLength] = useState(0);
    const [runTour, setRunTour] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const steps = [
        {
            target: "#types",
            content: "Select the type of enquiry you have from this dropdown.",
        },
        {
            target: "#subject",
            content: "Describe your enquiry briefly in this text area.",
        },
        {
            target: "button[type='submit']",
            content: "Click here to submit your enquiry once you're done.",
        }
    ];

    async function PostEnquiry(event) {
        event.preventDefault();
        const form = event.target;
        const re = /[^0-9a-zA-Z,.\s!?]/;
        if (re.test(form.subject.value)) {
            alert("You may only use characters or digits in your enquiry subject.");
        } else {
            const token = localStorage.getItem("token")?.toString() || "";
            const decodedObject = decodeToken(token);
            const decodedId = decodedObject?.["userId"];

            const response = await fetch("http://localhost:5050/enquiries/make", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: decodedId,
                    type: form.types.value,
                    message: form.subject.value
                })
            });

            if (!response.ok) {
                console.error('Error:', response.statusText);
            } else {
                const data = await response.json();
                console.log(data);
                // Redirect on success
                window.location.href = '/user/enquiries/view';
            }
        }
    }

    const handleConfirm = () => {
        setShowDialog(false); // Close the dialog
        // Submit the form on confirmation
        document.getElementById("enquiry-form").requestSubmit();
    };

    return (
        <>
            <Navbar />
            <Joyride steps={steps} run={runTour} continuous showProgress showSkipButton />
            <div className="w-full h-screen flex">
                <div className="flex flex-col w-full items-center">
                    <div className="w-3/5">
                        <h1 className="text-2xl font-semibold mt-8 mb-8 md:text-3xl">Make An Enquiry</h1>
                    </div>
                    <div className="bg-gray-slate-100 w-3/5 border-y-2 flex justify-center mb-10">
                        <h3 className="font-sans p-2.5 font-medium text-lg">For urgent matters, please call us directly at 6535 7677</h3>
                    </div>
                    <form className="drop-shadow-2xl bg-white w-3/5 h-4/6 rounded-lg flex flex-col justify-center items-center relative" id="enquiry-form" onSubmit={PostEnquiry}>
                        <button 
                            id="walkthrough-button"
                            className="bg-red-600 text-white px-4 py-2 rounded absolute top-6 right-6 hover:bg-blue-800"
                            onClick={() => setRunTour(true)}
                        >
                            Start Walkthrough
                        </button>
                        <label htmlFor="types" className="w-7/12 mt-10">Enquiry Type:</label>
                        <select id="types" name="types" className="p-2 border mb-4 w-7/12 rounded mt-2" required>
                            <option value="OCBC Mobile App">OCBC Mobile App</option>
                            <option value="Loans">Loans/Collections</option>
                            <option value="Banking Card">Credit/Debit Card</option>
                            <option value="Premier Services">Premier Services</option>
                            <option value="Investments">Investment/Securities</option>
                            <option value="Account">Bank Account</option>
                            <option value="Other">Other</option>
                        </select>
                        <label htmlFor="subject" className="w-7/12 mt-2">Enquiry Subject:</label>
                        <textarea id="subject" name="subject" className="h-32 border mt-2 w-7/12 rounded resize-none p-2" required maxLength={80} onChange={e => setSubjectLength(e.target.value.length)}></textarea>
                        <p className="font-light mt-2 w-7/12">Characters Left: {80 - subjectLength}</p>
                        <Dialog open={showDialog} onOpenChange={setShowDialog}>
                            <DialogTrigger className="bg-red-600 w-3/12 text-white p-1.5 rounded mt-10 mb-8 hover:bg-red-800" disabled={subjectLength === 0} onClick={() => setShowDialog(true)}>
                                Send
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Confirm your enquiry</DialogTitle>
                                    <DialogDescription>
                                        Confirm that you want to submit this enquiry to be reviewed.
                                    </DialogDescription>
                                    <DialogFooter>
                                        <motion.button
                                            className="bg-red-600 text-sm text-white rounded px-4 py-2"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleConfirm}
                                        >
                                            Confirm
                                        </motion.button>
                                    </DialogFooter>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </form>
                </div>
            </div>
        </>
    );
}

export default MakeEnquiry;
