import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Enquiries({ type }) {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [enquiries, setEnquiries] = useState([]);

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchEnquiries();
        }
    }, [userId]);

    async function getUser() {
        const response = await fetch(`http://localhost:5050/decode/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),
            }),
        });

        const result = await response.json();
        setUserId(result.userId);
        console.log(result.userId);
    }

    async function fetchEnquiries() {
        const response = await fetch("http://localhost:5050/enquiries/user");
        const data = await response.json();
        
        const userEnquiries = Array.isArray(data)
            ? data 
            : data.enquiries || []; 
    
        setEnquiries(userEnquiries);
    }

    // Filter enquiries based on type and render a message if no enquiries found
    const filteredEnquiries = enquiries.filter(enquiry =>
        type === "Active"
            ? enquiry.status === "Open" || enquiry.status === "Responding"
            : enquiry.status === "Closed"
    );

    const enquiryElements = filteredEnquiries.length > 0
        ? filteredEnquiries.map((enquiry, index) => (
            <div
                key={index}
                className="bg-white w-full p-3 shadow-md rounded mt-1 flex items-center cursor-pointer z-10 opacity-100"
                onClick={() => {
                    navigate("/enquiries/response", { state: { enquiry } });
                }}
            >
                <p className="font-sans text-gray-800 text-sm flex-grow">
                    {`${enquiry.type || "Enquiry"} - ${enquiry.message || "Undefined"}`}
                </p>
            </div>
        ))
        : <p className="text-gray-500 text-center mt-4">
            {type === "Active" ? "No active enquiries found." : "No closed enquiries found."}
          </p>;

    return <>{enquiryElements}</>;
}

const ChatbotButton = ({ isOpen, toggleChat }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-red-600 text-white rounded-full p-4 shadow-lg cursor-pointer"
            onClick={toggleChat}
        >
            <motion.img
                src="/images/Chatbot.png"
                alt="Chatbot"
                className="w-12 h-12 object-contain"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
        
    );
};

const ChatbotPopup = ({ isOpen, toggleChat, messages, setMessages, clearChat }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = async () => {
        if (newMessage.trim() !== "") {
            // Immediately add the user's message to the state
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: newMessage, isUser: true },
            ]);

            const currentMessage = newMessage; // Capture the current message
            setNewMessage(""); // Clear the input field
            setIsTyping(true); // Set bot to typing state

            try {
                const response = await fetch("http://localhost:3000/generate-text", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ prompt: currentMessage }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Add the bot's response to the state
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { text: data.text, isUser: false },
                    ]);
                } else {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            text: "Error: Unable to get a response from the server.",
                            isUser: false,
                        },
                    ]);
                }
            } catch (error) {
                console.error("Error:", error);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        text: "Error: Unable to connect to the server.",
                        isUser: false,
                    },
                ]);
            } finally {
                setIsTyping(false); // Stop typing state
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-28 right-6 w-[400px] h-[520px] bg-white rounded-lg shadow-lg overflow-hidden z-40"
                >
                    {/* Header */}
                    <div className="bg-red-600 text-white font-bold p-5 flex items-center justify-between">
                        <div className="flex items-center">
                            <img
                                src="/images/UserIcon.png"
                                alt="Chatbot Icon"
                                className="w-10 h-10 object-contain mr-3"
                            />
                            <span>Chat with ChatterBot!</span>
                        </div>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="text-xl focus:outline-none"
                        >
                            &#x22EE;
                        </button>
                        {showMenu && (
                            <div className="absolute right-8 bg-white shadow-lg rounded-lg">
                                <button
                                onClick={() => {
                                    clearChat();
                                    setShowMenu(false);
                                }}
                                className="block w-full px-6 py-2 rounded-lg text-gray-700 hover:bg-gray-300 hover:text-gray-900 transition-all duration-200"
                            >
                                Clear Chat
                            </button>

                            </div>
                        )}
                    </div>

                    {/* Messages */}
                    <div className="p-4 h-[380px] overflow-y-auto bg-gray-50">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`mb-4 flex ${
                                    message.isUser ? "justify-end" : "justify-start"
                                }`}
                            >
                                <p
                                    className={`p-2 rounded-lg max-w-xs ${
                                        message.isUser
                                            ? "bg-red-500 text-white text-right"
                                            : "bg-gray-200 text-gray-700 text-left"
                                    }`}
                                >
                                    {message.text}
                                </p>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="mb-4 flex justify-start">
                                <p className="p-2 rounded-lg max-w-xs bg-gray-200 text-gray-700 text-left">
                                    ChatterBot is typing...
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Input Box */}
                    <div className="p-2 bg-gray-50 border-t flex items-center">
                        <input
                            type="text"
                            placeholder="Enter your message..."
                            className="flex-1 border rounded-lg px-3 py-2 mr-2 text-gray-700"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSendMessage();
                                }
                            }}
                        />
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded-lg"
                            onClick={handleSendMessage}
                        >
                            <span>&#9658;</span>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

function ActiveEnquiriesCustomer() {
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! What can I help with today?", isUser: false },
    ]);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const clearChat = () => {
        setMessages([{ text: "Hello! What can I help with today?", isUser: false }]); // Reset to system message
    };


    return (
        <div
            className="relative flex flex-col min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/images/enquiriescustomer.jpeg')" }}
        >
            <div className="absolute inset-0 bg-white opacity-30"></div>

            <Navbar />
            <div className="relative w-full h-screen px-10">
                <h1 className="lg:text-3xl md:text-xl sm:text-base font-semibold mt-8">
                    Open Enquiries
                </h1>
                <div className="flex justify-center gap-10 mt-10">
                    <div className="bg-gray-100 w-2/3 px-8 py-6 shadow-lg rounded-lg opacity-70">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Active Enquiries</h2>
                        <Enquiries type="Active" />
                        <div className="flex justify-center mt-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
                                onClick={() => navigate("/user/enquiries/make")}
                            >
                                Make a New Enquiry
                            </motion.button>
                        </div>
                    </div>

                    <div className="bg-gray-100 w-1/3 px-8 py-6 shadow-lg rounded-lg opacity-70">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Past Enquiries</h2>
                        <Enquiries type="Past" />
                    </div>
                </div>
            </div>
            <ChatbotButton isOpen={isChatOpen} toggleChat={toggleChat} />
            <ChatbotPopup
                isOpen={isChatOpen}
                toggleChat={toggleChat}
                messages={messages}
                setMessages={setMessages}
                clearChat={clearChat}
            />
        </div>
    );
}

export default ActiveEnquiriesCustomer;
