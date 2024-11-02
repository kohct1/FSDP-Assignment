import Navbar from "./components/Navbar";
import {useState} from 'react';






function MakeEnquiry() {
    const [subjectText, setSubjectText] = useState(0);
    
    return (
        <>
            <Navbar />
            <div></div>
            <div className="w-full h-screen flex ">
                <div className="flex flex-col w-full items-center">
                    <div className="w-3/5">
                        <h1 className="text-2xl font-semibold mt-8 mb-8 md:text-3xl">Make An Enquiry</h1>
                    </div>
                        <div className="bg-gray-slate-100 w-3/5 border-y-2 flex justify-center mb-10">
                            <h3 className="font-sans p-2.5 font-medium text-lg">For urgent matters, please call us directly at 6535 7677</h3>
                        </div>
                        <form className="drop-shadow-2xl bg-white w-3/5 h-4/6 rounded-lg flex flex-col justify-center items-center" id="enquiries-container">
                            <label htmlFor="types" className="w-7/12">Enquiry Type:</label>
                            <select id="types" name="enquirytypes" className="pt-1 pb-1 pl-1.5 border-2 mb-4 w-7/12 mt-2" required>
                                <option value="mobile">OCBC Mobile App</option>
                                <option value="loan">Loans/Collections</option>
                                <option value="card">Credit/Debit Card</option>
                                <option value="premier">Premier Services</option>
                                <option value="investment">Investment/Securities</option>
                                <option value="account">Bank Account</option>
                                <option value="other">Other</option>
                            </select>
                            <label htmlFor="subject" className="w-7/12 mt-2">Enquiry Subject:</label>
                            <textarea id="subject" name="subject" className= "h-32 border-2 mt-2 w-7/12" required maxLength={80}  onChange={e => setSubjectText(e.target.value.length)}></textarea>
                            <p className="font-light mt-2 w-7/12">Characters Left: {80-subjectText}</p>
                            <button className="bg-red-600 w-3/12 text-white p-1.5 rounded-md mt-10 mb-8 hover:bg-red-800" type="submit">Send</button>
                        </form>
                </div>

            </div>
        </>
    );
}

export default MakeEnquiry;
