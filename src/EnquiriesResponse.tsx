import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "./components/Navbar";

function EnquiryDetail() {
    const { state } = useLocation();
    const enquiry = state.enquiry;
    const [userId, setUserId] = useState(null);

    console.log(state);

    useEffect(() => {
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

    const handleSendMessage = async (e) => {
        e.preventDefault();
    
        const isUser = userId === enquiry.postedBy;
        const isStaff = userId === enquiry.responseBy;
    
        if (!isStaff && !isUser) {
            console.error("You do not have permission to send messages for this enquiry.");
            return;
        }
    
        if (inputMessage.trim()) {
            const newMessage = {
                chatMessage: inputMessage,
                postedByID: isUser ? userId : null,
                respondedByID: isStaff ? userId : null,
                timestamp: new Date().toISOString()
            };
    
            const messageData = {
                enquiryId: enquiry._id,
                message: inputMessage,
                senderId: userId,
                postedByID: isUser ? userId : null,
                respondedByID: isStaff ? userId : null
            };
    
            try {
                const response = await fetch("http://localhost:5050/enquiries/sendMessage", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(messageData)
                });
    
                if (!response.ok) {
                    const textResponse = await response.text();
                    console.error("Error sending message:", textResponse);
                } else {
                    const data = await response.json();
                    console.log("Message sent:", data);
    
                    setMessages(prevMessages => [...prevMessages, newMessage]);
                    setInputMessage("");
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };   

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <Navbar />

            <h1 className="text-2xl font-semibold text-gray-800 py-4 p-12">
                {enquiry?.type} - {enquiry?.message}
            </h1>

            <div className="bg-gray-100 p-6 rounded-lg shadow-md h-76 overflow-y-auto mx-12">
                {messages.length === 0 ? (
                    <p className="text-gray-600 text-center mb-4">
                        Create a message to begin the conversation.
                    </p>
                ) : null}

                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex items-start mb-4 ${msg.postedByID ? 'justify-start' : 'justify-end'}`}
                    >
                        <div className="inline-flex max-w-full p-4 rounded-lg shadow-md bg-white items-center">
                            <p className="text-gray-800 font-medium whitespace-nowrap mr-5">
                                {msg.postedByID === userId ? "You" : msg.postedByID ? "User" : "Staff"}
                            </p>
                            <p className="text-gray-700">{msg.chatMessage}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} /> 
                <p className="text-center text-gray-500 mt-6">-End of Conversation-</p>
            </div>

        {enquiry?.status === "Closed" ? (
            <p className="text-center text-gray-500 mt-6">This enquiry is closed. No further messages can be sent.</p>
        ) : (userId !== enquiry.postedBy && userId !== enquiry.responseBy) ? (
            <p className="text-center text-gray-500 mt-6">You do not have permission to send messages for this enquiry.</p>
        ) : (
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
        )}
        </div>
    );
}

export default EnquiryDetail;
