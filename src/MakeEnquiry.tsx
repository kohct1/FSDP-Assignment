import Navbar from "./components/Navbar";
import {useState} from 'react';
import {decodeToken} from "react-jwt";



async function PostEnquiry(event : any) {
    event.preventDefault();
    const form = event.target;
    const re = /[^0-9a-zA-Z,.]/;
    if (re.test(form.subject.value)) {
        alert("You may only use characters or digits in your enquiry subject.");
    }
    else {
        let token : string;
        //compiler will complain if i dont parse as string
        token = localStorage.getItem("token")?.toString()!;
        const decodedObject =  decodeToken(token);
        //This line may show an error, but it works as intended
        const decodedId = decodedObject["userId"];
        
      
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
            console.log(data); // Check the response from the server
        }
        alert("Response submitted!");
        location.reload();
    }
     
}

function MakeEnquiry() {
    const [subjectLength, setSubjectLength] = useState(0);
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
                        <form  onSubmit={PostEnquiry} className="drop-shadow-2xl bg-white w-3/5 h-4/6 rounded-lg flex flex-col justify-center items-center" id="enquiries-container">
                            <label htmlFor="types" className="w-7/12">Enquiry Type:</label>
                            <select id="types" name="types" className="pt-1 pb-1 pl-1.5 border-2 mb-4 w-7/12 mt-2" required>
                                <option value="OCBC Mobile App">OCBC Mobile App</option>
                                <option value="Loans">Loans/Collections</option>
                                <option value="Banking Card">Credit/Debit Card</option>
                                <option value="Premier Services">Premier Services</option>
                                <option value="Investments">Investment/Securities</option>
                                <option value="Account">Bank Account</option>
                                <option value="Other">Other</option>
                            </select>
                            <label htmlFor="subject" className="w-7/12 mt-2">Enquiry Subject:</label>
                            <textarea id="subject" name="subject" className= "h-32 border-2 mt-2 w-7/12" required maxLength={80}  onChange={e => {setSubjectLength(e.target.value.length)}}></textarea>
                            <p className="font-light mt-2 w-7/12">Characters Left: {80-subjectLength}</p>
                            <button className="bg-red-600 w-3/12 text-white p-1.5 rounded-md mt-10 mb-8 hover:bg-red-800" type="submit">Send</button>
                        </form>
                </div>
            </div>
        </>
    )
}

export default MakeEnquiry;
