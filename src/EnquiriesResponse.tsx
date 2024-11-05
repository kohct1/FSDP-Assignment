import React, { useState, useRef, useEffect } from 'react';
import Navbar from "./components/Navbar";

function EnquiryDetail() {
    // hardcoded data for testing
    const initialMessages = [
        {
            sender: "Jason Tan",
            id: "9876",
            message: "Hello, I am having issues logging in. Could you provide me with some assistance?",
            isStaff: false
        },
        {
            sender: "Marie Li",
            id: "2347",
            message: "Sure thing, can you describe your issue in greater detail?",
            isStaff: true
        },
        {
            sender: "Jason Tan",
            id: "9876",
            message: "Well, this morning I was drinking coffee when my dog got hungry. I tried to feed it, but then I realised my salary just came in. So I tried to log in to your app to withdraw my salary, but then right I cannot remember my password! I key in once, key in twice, key in THRICE! Still cannot! Then how? Please help! I think my password starts with L and ends with L.",
            isStaff: false
        }
    ];

    const [messages, setMessages] = useState(initialMessages);
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
                id: "9876", 
                message: inputMessage,
                isStaff: false
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setInputMessage(""); 
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <Navbar />

            <h1 className="text-2xl font-semibold text-gray-800 py-4 p-12">
                OCBC Mobile App - Issues logging in app, forgot password and would like to reset
            </h1>

            <div className="bg-gray-100 p-6 rounded-lg shadow-md h-76 overflow-y-auto mx-12">
                <p className="text-gray-600 text-center mb-4">
                    A staff member has approved your enquiry. Create a message to begin the conversation.
                </p>
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start mb-4 ${msg.isStaff ? 'justify-end' : 'justify-start'}`}>
                        <div className="inline-flex max-w-full p-4 rounded-lg shadow-md bg-white items-center">
                            <p className="text-gray-800 font-medium whitespace-nowrap mr-5">
                                {msg.sender} {msg.isStaff ? `Staff-${msg.id}` : `ID-${msg.id}`}
                            </p>
                            <p className="text-gray-700">{msg.message}</p>
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
