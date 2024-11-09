import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "./components/Navbar";

function EnquiryDetail() {
    const location = useLocation();
    const enquiry = location.state?.enquiry; 
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // log for testing
        console.log("Enquiry data received:", enquiry); 
        getUser();
    }, []);

    async function getUser() {
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
        console.log("User ID:", result.userId); 
    }

    const [messages, setMessages] = useState(enquiry?.messages || []); 
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            const newMessage = {
                sender: "Jason Tan",
                id: userId,
                message: inputMessage,
                isStaff: false
            };
            // Update the messages state
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages, newMessage];
                // log for testing
                console.log("Updated messages array:", updatedMessages); 
                return updatedMessages;
            });
            setInputMessage(""); // Clear input field
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <Navbar />

            <h1 className="text-2xl font-semibold text-gray-800 py-4 p-12">
                {enquiry?.type} - {enquiry?.message}
            </h1>

            <div className="bg-gray-100 p-6 rounded-lg shadow-md h-76 overflow-y-auto mx-12">
                <p className="text-gray-600 text-center mb-4">
                    A staff member has approved your enquiry. Create a message to begin the conversation.
                </p>
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start mb-4 ${msg.respondedByID ? 'justify-end' : 'justify-start'}`}>
                        <div className="inline-flex max-w-full p-4 rounded-lg shadow-md bg-white items-center">
                            <p className="text-gray-800 font-medium whitespace-nowrap mr-5">
                                {msg.respondedByID ? "Staff" : "User"} - {msg.postedByID}
                            </p>
                            <p className="text-gray-700">{msg.chatMessage}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} /> 
                <p className="text-center text-gray-500 mt-6">-End of Conversation-</p>
            </div>

            <form className="mt-6 p-12" onSubmit={handleSendMessage}>
                <div className="flex">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow p-2 border border-gray-300 rounded-l"
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-r">Send</button>
                </div>
            </form>
        </div>
    );
}

export default EnquiryDetail;
