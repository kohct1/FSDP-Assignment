import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

    useEffect(() => {
        const savedMessages = localStorage.getItem("chatMessages");
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }
    }, []);

    const handleSendMessage = async () => {
        if (newMessage.trim() !== "") {
            const userMessage = { text: newMessage, isUser: true };

            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, userMessage];
                localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
                return updatedMessages;
            });

            const currentMessage = newMessage; 
            setNewMessage("");
            setIsTyping(true); 

            // Check if the user is requesting a live agent
        const liveAgentKeywords = ["live agent", "real person", "human", "customer support", "real person", "person", "enquiry", "make enquiry"];
        if (liveAgentKeywords.some(keyword => currentMessage.toLowerCase().includes(keyword))) {
            const botMessage = {
                text: "You can speak to a live agent by making a new enquiry.",
                isUser: false,
                button: { text: "Make a New Enquiry", link: "/user/enquiries/make" }
            };

            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, botMessage];
                localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
                return updatedMessages;
            });

            setIsTyping(false);
            return;
        }

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
                    const botMessage = { text: data.text, isUser: false };

                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages, botMessage];
                        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
                        return updatedMessages;
                    });
                } else {
                    const errorMessage = {
                        text: "Error: Unable to get a response from the server.",
                        isUser: false,
                    };
    
                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages, errorMessage];
                        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
                        return updatedMessages;
                    });
                }
            } catch (error) {
                console.error("Error:", error);
                const errorMessage = {
                    text: "Error: Unable to connect to the server.",
                    isUser: false,
                };
    
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages, errorMessage];
                    localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
                    return updatedMessages;
                });
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
                                <div className={`p-2 rounded-lg max-w-xs ${message.isUser ? "bg-red-500 text-white text-right" : "bg-gray-200 text-gray-700 text-left"}`}>
                                    <p>{message.text}</p>
                                    {message.button && (
                                        <button
                                            className="mt-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                                            onClick={() => window.location.href = message.button.link}
                                        >
                                            {message.button.text}
                                        </button>
                                    )}
                                </div>
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
    const [userId, setUserId] = useState(null);
    const [activeEnquiries, setActiveEnquiries] = useState();
    const [pastEnquiries, setPastEnquiries] = useState();
    const [pastElements, setPastElements] = useState();
    const [presentElements, setPresentElements] = useState();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! What can I help with today?", isUser: false },
    ]);
 
    useEffect(() => {
        getUser();
        fetchEnquiries();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchEnquiries();
        }
    }, [userId]);

    let pastEnquiryElements : any = [];
    let activeEnquiryElements : any = []; 

    useEffect(()=> {
        console.log(pastEnquiries);
        
        pastEnquiryElements = pastEnquiries?.map((enquiry : any) => {
            return(<>
                <div key={enquiry._id} className="bg-white w-full p-3 shadow-md rounded mt-1 flex items-center cursor-pointer z-10 opacity-100 hover:bg-gray-200" onClick={() => handleClick(enquiry._id.toString())}>
                    <p className="font-sans text-gray-800 text-sm flex-grow">
                        {`${enquiry.type || "Enquiry"} - ${enquiry.message || "Undefined"}`}
                    </p>
                </div></>)
        });
    
        activeEnquiryElements = activeEnquiries?.map((enquiry : any) => {
            return(<>
                <div key={enquiry._id} className="bg-white w-full p-3 shadow-md rounded mt-1 flex items-center cursor-pointer z-10 opacity-100 hover:bg-gray-200" onClick={() => handleClick(enquiry._id.toString())}>
                    <p className="font-sans text-gray-800 text-sm flex-grow">
                        {`${enquiry.type || "Enquiry"} - ${enquiry.message || "Undefined"}`}
                    </p>
                </div></>)
        });
        setPastElements(pastEnquiryElements);
        setPresentElements(activeEnquiryElements);
    }, [pastEnquiries]);

    

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
    }

    async function fetchEnquiries() {
        const response = await fetch("http://localhost:5050/enquiries");
        const enquiryData = await response.json();
        console.log(enquiryData);
        let aEnquiries = [];
        let pEnquiries = [];
      
        for(let i = 0; i < enquiryData["enquiries"].length; i++) {
            if(enquiryData["enquiries"][i]["status"] == "Responding" || enquiryData["enquiries"][i]["status"] == "Open") {
                aEnquiries.push(enquiryData["enquiries"][i]);
            }
            else {
                pEnquiries.push(enquiryData["enquiries"][i]);
            }
        }
        console.log(pEnquiries);
        setActiveEnquiries(aEnquiries);
        setPastEnquiries(pEnquiries);
    }

    function handleClick(enquiryId : string) {
        localStorage.setItem("currentEnquiryID", enquiryId);
        navigate("/enquiries/response");
    }

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const clearChat = () => {
        setMessages([{ text: "Hello! What can I help with today?", isUser: false }]);
        localStorage.removeItem("chatMessages");
    };

    useEffect(() => {
        const handleBeforeUnload = () => localStorage.removeItem("chatMessages");
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    return (
        <div
            className="relative flex flex-col min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/images/enquiriescustomer.jpeg')" }}
        >
            <div className="absolute inset-0 bg-white opacity-30"></div>

            <Navbar />
            <div className="relative w-full h-screen px-10">
                <div className="bg-gray-100 shadow-lg rounded-lg opacity-90 lg:w-[305px] pb-3 flex align-center pt-3 mt-10 md:w-[260px] w-[220px]">
                    <h1 className="lg:text-2xl md:text-xl sm:text-base font-semibold ml-10">
                        Customer Enquiries
                    </h1>
                </div>
                <div className="flex justify-center gap-10 mt-10">
                    <div className="bg-gray-100 w-2/3 px-8 py-6 shadow-lg rounded-lg opacity-90">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Active Enquiries</h2>
                        {
                            activeEnquiries?.length != 0 ? presentElements : 
                            <p className="text-gray-500 text-center mt-4">
                                "No active enquiries found."
                            </p>
                        }
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
                    <div className="bg-gray-100 w-1/3 px-8 py-6 shadow-lg rounded-lg opacity-90">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Past Enquiries</h2>
                        {
                            pastEnquiries?.length != 0 ? pastElements :
                            <p className="text-gray-500 text-center mt-4">
                                "No closed enquiries found."
                            </p>
                        }
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
