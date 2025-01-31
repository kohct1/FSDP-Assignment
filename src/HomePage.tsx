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

function HomePage() {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        getUser();
      }, []);

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
        console.log(result.userId);
      }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <section className="relative bg-gray-200">
        <img
          src="/images/OCBC_1.png"
          alt="Welcome Background"
          className="w-full h-full object-cover"
        />
      </section>

       <div className="relative max-w-7xl mx-auto -mt-24 p-8 bg-white shadow-lg rounded-lg">
        <div className="flex justify-around text-left space-x-4">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">Banking for individuals</h2>
            <ul className="space-y-2 text-blue-600 text-lg">
              <li><a href="#frank" className="hover:underline">FRANK by OCBC</a></li>
              <li><a href="#personal" className="hover:underline">Personal Banking</a></li>
              <li><a href="#premier" className="hover:underline">Premier Banking</a></li>
              <li><a href="#private" className="hover:underline">Premier Private Client</a></li>
            </ul>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">Banking for businesses</h2>
            <ul className="space-y-2 text-blue-600 text-lg">
              <li><a href="#business" className="hover:underline">Business Banking</a></li>
              <li><a href="#corporates" className="hover:underline">Large Corporates</a></li>
            </ul>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">OCBC Group</h2>
            <ul className="space-y-2 text-blue-600 text-lg">
              <li><a href="#about" className="hover:underline">About us</a></li>
              <li><a href="#sustainability" className="hover:underline">Sustainability</a></li>
              <li><a href="#careers" className="hover:underline">Careers</a></li>
              <li><a href="#investors" className="hover:underline">Investors</a></li>
            </ul>
          </div>
        </div>
      </div>

      <section className="max-w mx-auto my-16 p-12 bg-white shadow-lg rounded-lg">
        <div className="text-2xl font-semibold text-red-500 mb-4">HIGHLIGHTS</div>
        <div className="flex flex-col md:flex-row items-center mt-6">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h3 className="text-3xl font-semibold text-gray-800 mb-4">
              ASEAN and Greater China. A land of aspirations.
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              As one Group, we enable your ambitions across borders.
            </p>
            <button className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 text-lg">
              Find out more
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/OCBC_2.png"
              alt="Highlights"
              className="rounded-md shadow-md max-w-full h-auto"
            />
          </div>
        </div>
      </section>
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

export default HomePage;