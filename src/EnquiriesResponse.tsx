import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "./components/Navbar";
import useWebSocket from "react-use-websocket";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function EnquiryDetail() {
    const { state } = useLocation();
    //Retrieve enquirydata from state.enquiry
    const enquiry = state.enquiry;
    const [userId, setUserId] = useState(null);
    const username = localStorage.getItem('username');
    const wsURL = `ws://localhost:8080?username=${username}`;
    const {lastMessage, sendJsonMessage} = useWebSocket<any>(wsURL, {share: true, shouldReconnect: () => true});
    const [messageData, setMessageData] = useState();
    const [messages, setMessages] = useState(enquiry?.messages || []); 
    const [inputMessage, setInputMessage] = useState("");
    const [postedUser, setPostedUser] = useState("");
    const [respondingUser, setRespondingUser] = useState("");
    const messagesEndRef = useRef(null);
    const userRole = localStorage.getItem("role");
    const [newMessage, setNewMessage] = useState(Object); 
    const [userIds, setUserIds] = useState([""]);

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

    //retrieves message names from database for both users.
    async function getMessageUsers(postedId : any, respondingId : any) {
        console.log("Posted ID: " + postedId + " \nResponding ID: " + respondingId);
        const response = await fetch(`http://localhost:5050/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
       
        const result = await response.json();
        let keys = Object.keys(result["user"]);
        let email = "";
        let email2 = "";
        for(let i = 0; i < keys.length; i++){
            if (result["user"][i]["_id"] == postedId) {
                email = result["user"][i]["email"];
            }
            if (result["user"][i]["_id"] == respondingId) {
                email2 = result["user"][i]["email"];
            }
        }
        
        const tempArray = email.split('@');
        const tempArray2 = email2.split('@');
        let username = tempArray[0].charAt(0).toUpperCase() + tempArray[0].slice(1);
        let username2 = tempArray2[0].charAt(0).toUpperCase() + tempArray2[0].slice(1);
        setPostedUser(username);
        setRespondingUser(username2);
        console.log("Posted User: " + username + "\nResponding User: " + username2);
    }

    useEffect(() => {
        getUser();
    });
    
    useEffect(() => {
        let isResponding = "False";
        if(enquiry.responseBy == userId) {
            isResponding = "True";
        }
        sendJsonMessage({
            message: {

            },
            state: 
            {
                typing: "Not typing",
                status: "Online",
                onEnquiry: isResponding,
                role: userRole
            }
        });
    }, [userId]);

    //Listens for new messages on the websocket connection
    useEffect(() => {
        if(lastMessage) {
            const message = lastMessage.data;
            const messageData = JSON.parse(message);
            setMessageData(messageData);
            let keys = Object.keys(messageData);
            for(let i = 0; i < keys.length; i++) {
                let username = messageData[keys[i]]["username"];
                let message = messageData[keys[i]]["message"];
                //Checks if current message is sent to correct enquiry
                if((username == postedUser || username == respondingUser) && message.enquiryID == enquiry.id) {
                    let chatMessage = message.chatMessage;
                    let postedById = message.postedByID;
                    let respondedById = message.respondedByID;
                    let timestamp = message.timestamp;
                    //Deal with the appending tmr and test with desktop client
                    messages.append({chatMessage: chatMessage, postedByID: postedById, respondedByID: respondedById, timestamp: timestamp});
                    console.log("passed: " + username + " message: " + JSON.stringify(message));
                }
            }
            

        }
    }, [lastMessage]);

    //Sends websocket message when new message is set
    useEffect(() => {
        if(newMessage) {
            let isResponding = "False";
            let messageContent = newMessage.chatMessage;
            let postedId = newMessage.postedBy;
            let respondingId = newMessage.respondedBy;
            let timestamp = newMessage.timestamp;
           
            if(enquiry.responseBy == userId) {
                isResponding = "True";
            }
            sendJsonMessage(
                {
                    state:
                    {
                        typing: "Not typing",
                        status: "Online",
                        onEnquiry: isResponding,
                        role: userRole
                    },
                    message: 
                    {
                        chatMessage : messageContent,
                        postedByID : postedId,
                        respondedByID : respondingId,
                        timestamp : timestamp,
                        enquiryId : enquiry._id
                    }
                }
            );
        }
    }, [newMessage]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        console.log(messages);
        let postedId;
        let respondingId;
        if(messages) {
            for(let i = 0; i < messages.length; i++) {
                if(messages[i].postedByID != null) {
                    postedId = messages[i].postedByID;
                }
                if(messages[i].respondedByID != null) {
                    respondingId = messages[i].respondedByID;
                }
            }
        }
        setUserIds([postedId, respondingId]);
        getMessageUsers(postedId, respondingId);
       
    }, [messages]);

    


    const handleSendMessage = async (e) => {
        e.preventDefault();
    
        const isUser = userId === enquiry.postedBy;
        const isStaff = userId === enquiry.responseBy;
        const postedByID = isUser ? userId : null;
        const respondedByID = isUser ? userId : null;


        if (!isStaff && !isUser) {
            console.error("You do not have permission to send messages for this enquiry.");
            return;
        }
    
        if (inputMessage.trim()) {
            const newMessage = {
                chatMessage: inputMessage,
                postedByID: postedByID,
                respondedByID: respondedByID,
                timestamp: new Date().toISOString()
            };

            const messageData = {
                enquiryId: enquiry._id,
                message: inputMessage,
                senderId: userId,
                postedByID: postedByID,
                respondedByID: respondedByID
            };

            setNewMessage(
                {
                    chatMessage : inputMessage,
                    postedByID : postedByID,
                    respondedByID : respondedByID,
                    timestamp : new Date().toISOString(),
                }
            )
    
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
                    //Sets previous messages here
                    setMessages(prevMessages => [...prevMessages, newMessage]);
                    setInputMessage("");
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };   
    let onlineUser = [''];
    let onlineStaff = [''];
    if(messageData) {
        let keys = Object.keys(messageData);
        for(let i = 0; i < keys.length; i++) {
            let username = messageData[keys[i]]["username"];
            let message = messageData[keys[i]];
            let status = message["state"]["status"];
            let role = message["state"]["role"];
            if(status == "Online" && role == "Staff") {
                onlineStaff.push(username);
            }
            else if (status == "Online") {
                onlineUser.push(username);
            }
        }
      
    }
    return (
        <div className="w-full min-h-screen bg-gray-50">
            <Navbar />

            <h1 className="text-2xl font-semibold text-gray-800 py-4 p-12 mb-9 mt-9 flex justify-between">
                <div className="ml-4">
                    {enquiry?.type} - {enquiry?.message}
                </div>
                <DropdownMenu>
                        <DropdownMenuTrigger className="border-2 p-2 rounded-md mr-14 bg-red-600 text-white text-base">Staff Status</DropdownMenuTrigger>
                        <DropdownMenuContent className="mt-2 flex flex-col pb-2">
                            <DropdownMenuLabel className="text-base pb-0 mt-2">Online Staff ({onlineStaff.length -1})</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            {onlineStaff.map(name => (
                                <p key={name} className="ml-2 mt-0.5">{name}</p>
                            ))}
                             <DropdownMenuLabel className="text-base pb-0 mt-4">Online Users ({onlineUser.length -1})</DropdownMenuLabel>
                             <DropdownMenuSeparator/>
                             {onlineUser.map(name => (
                                <p key={name} className="ml-2 mt-0.5">{name}</p>
                            ))}
                        </DropdownMenuContent>
                </DropdownMenu>
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
                            <p className="text-gray-800 font-medium whitespace-nowrap mr-2">
                                {msg.postedByID == userId ? username + ":" : msg.postedByID ? postedUser +":" : respondingUser + ":"}
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
