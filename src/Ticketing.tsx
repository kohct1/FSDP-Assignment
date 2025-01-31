import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';

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

const Ticketing = () => {
    const [queueCount, setQueueCount] = useState(0);
    const [leftQueue, setLeftQueue] = useState(0); // New state for leftQueue
    const [lastUpdatedTime, setLastUpdatedTime] = useState("");
    const navigate = useNavigate();
      const [isChatOpen, setIsChatOpen] = useState(false);
        const [messages, setMessages] = useState([
            { text: "Hello! What can I help with today?", isUser: false },
        ]);

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

   // Fetch queue data from the backend
   const fetchQueueData = async () => {
        try {
            const response = await fetch("http://localhost:5050/queue");
            if (response.ok) {
                const data = await response.json();
                setQueueCount(data.queueCount);
                setLeftQueue(data.leftQueue);
                setLastUpdatedTime(getCurrentTime());
            } else {
                console.error("Failed to fetch queue data");
            }
        } catch (error) {
            console.error("Error fetching queue data:", error);
        }
    };

    // Increment queue count by calling the backend
    const startQueue = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5050/queue', {
                method: 'POST',
            });
            if (response.ok) {
                fetchQueueData(); // Refresh queue data after incrementing
            } else {
                console.error("Failed to increment queue count");
            }
        } catch (error) {
            console.error("Error incrementing queue count", error);
        }
        navigate("/queue");
    };

    // Function to format the current time as hh:mm:ss AM/PM
    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours() % 12 || 12;
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        const ampm = now.getHours() >= 12 ? "PM" : "AM";
        return `${hours}:${minutes}:${seconds} ${ampm}`;
    };

    // Calculate waiting time in minutes
    const calculateDynamicWaitingTime = () => {
        const queue = Math.max(queueCount - leftQueue, 0); // Ensure queue is non-negative
        const servers = 5; // Number of agents/servers
        const shiftDuration = 8 * 60; // Shift duration in minutes (8 hours)
        const callsPerShift = 40; // Average calls handled per agent per shift
        const arrivalRate = queue > 0 ? queue / shiftDuration : 0.1; // Avoid zero
        const serviceRate = callsPerShift / shiftDuration || 0.1; // Avoid zero
        const rho = Math.min(arrivalRate / (servers * serviceRate), 0.99); // Cap at <1

        const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

        const P0 = (() => {
            let sum = 0;
            for (let n = 0; n < servers; n++) {
                sum += Math.pow(arrivalRate / serviceRate, n) / factorial(n);
            }
            const term = Math.pow(arrivalRate / serviceRate, servers) /
                (factorial(servers) * (1 - rho));
            return 1 / (sum + (rho < 1 ? term : 0));
        })();

        const Lq = (Math.pow(arrivalRate / serviceRate, servers) * P0 * rho) /
            (factorial(servers) * Math.pow(1 - rho, 2));

        const Wq = Lq / Math.max(arrivalRate, 1); // Ensure arrivalRate is non-zero
        return Math.max(Wq, 0).toFixed(2); // Ensure non-negative waiting time
    };

    const waitingTime = calculateDynamicWaitingTime();

    useEffect(() => {
        fetchQueueData();
        const intervalId = setInterval(fetchQueueData, 100); // Poll every 1ms
        return () => clearInterval(intervalId);
    }, []);

    const currentQueueCount = Math.max(queueCount - leftQueue, 0);

    return (
        <div className="relative flex flex-col min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/src/ticketing_bg.jpg')" }}>
            
            <div className="absolute inset-0 bg-white opacity-50"></div>

            <Navbar />

            <div className="relative z-10 flex justify-center items-center flex-grow">
                <div className="bg-white shadow-lg rounded-lg p-10 text-center max-w-md opacity-100">
                    <h2 className="text-lg font-medium">There are currently</h2>
                    <h1 className="text-6xl font-bold my-4">{currentQueueCount}</h1>
                    <p className="text-lg">People in the Queue</p>

                    <form onSubmit={startQueue}>
                        <motion.button
                            className="bg-red-600 text-white text-lg font-semibold px-6 py-3 rounded mt-8"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}>
                            Join the Queue
                        </motion.button>
                    </form>

                    <p className="text-lg mt-6">
                        Estimated Waiting Time: <strong>{waitingTime} minutes</strong>
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Status Last Updated: {lastUpdatedTime}
                    </p>

                    <p className="mt-4 text-sm text-black-700">
                        If it is not an urgent matter, please{' '}
                        <Link to="/bookingpage" className="text-blue-700 underline">book a slot</Link> instead.
                    </p>
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
};

export default Ticketing;
