import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { RiRobot3Line } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";

const Chatbot = ({ isOpen, setIsOpen }) => {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { text: "Hi! 👋 Welcome to NANDHA ENGINEERING COLLEGE. I’ll be assisting you here today.", sender: "bot" },
    { text: "Enter Your E-mail id to get started.", sender: "bot" },
  ]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() !== '') {
      try {
        const response = await axios.get(`http://localhost:5000/api/set_user?q=${email}`);
        const botResponse = response.data.response;
        setIsEmailSubmitted(true);
        setChatHistory([...chatHistory,{ text: email, sender: "user" }]);
        streamBotResponse(botResponse);
        setTimeout(()=> { streamBotResponse("Hey there! 👋 How can I help you today? 😊")},1000);
      } catch (error) {
        console.error("Error sending email to backend:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const u_message = message;
    setMessage('');
    if (u_message.trim() !== '') {
      setChatHistory([...chatHistory, { text: u_message, sender: "user" }]);
      try {
        const response = await axios.get(`http://localhost:5000/api/ask_bot`, {
          params: {
            q: u_message,
            email: email,
          }
        });        const botResponse = response.data.response;
        streamBotResponse(botResponse);
      } catch (error) {
        console.error("Error sending message to backend:", error);
      }
    }
  };

  const streamBotResponse = (response) => {
    let index = -1;
    setChatHistory(prevHistory => [...prevHistory, { text: '', sender: "bot", complete: false }]);
    const interval = setInterval(() => {
      if (index < (response.length) - 1) {
        setChatHistory(prevHistory => {
          const lastMessage = prevHistory[prevHistory.length - 1];
          return [
            ...prevHistory.slice(0, -1),
            { ...lastMessage, text: lastMessage.text + response[index] }
          ];
        });
        index++;
      } else {
        setChatHistory(prevHistory => {
          const lastMessage = prevHistory[prevHistory.length - 1];
          return [
            ...prevHistory.slice(0, -1),
            { ...lastMessage, complete: true }
          ];
        });
        clearInterval(interval);
      }
    }, 30);
  };

  const createMarkup = (text) => {
    let html = text.replace(/\n/g, '<br>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/^\*([^*]+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    return { __html: html };
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-4 right-4">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden w-[30rem] h-[40rem] flex flex-col justify-between">
            <div className="bg-[#61CE70] text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className=" rounded-full w-8 h-8 flex items-center justify-center mr-2">
                  <RiRobot3Line size={50} className='text-black' />
                </div>
                <h2 className="text-lg font-bold">NEC CHATBOT</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white"><IoIosClose size={35} /></button>
            </div>
            <div className="p-4 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full  scrollbar-thumb-gray-600 scrollbar-track-teal-50   ">
              <div className="mb-4">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === "bot" ? 'justify-start' : 'justify-end'} mt-2`}>
                    {msg.sender === "bot" ? (
                      <div className="p-4 rounded-lg bg-gray-100 max-w-xs" dangerouslySetInnerHTML={createMarkup(msg.text)} />
                    ) : (
                      <p className="p-4 rounded-lg bg-green-200 max-w-xs">
                        {msg.text}
                      </p>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </div>
            <div className="p-4 border-t flex items-center justify-between">
              {isEmailSubmitted ? (
                <form onSubmit={handleSubmit} className="flex w-full">
                  <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-grow p-2 border rounded-l-lg"
                    placeholder="Type your message..."
                  />
                  <button type="submit" className="bg-green-500 text-white px-4 rounded-r-lg hover:bg-green-600">Send</button>
                </form>
              ) : (
                <form onSubmit={handleEmailSubmit} className="flex w-full">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow p-2 border rounded-l-lg"
                    placeholder="Enter your email..."
                  />
                  <button type="submit" className="bg-green-500 text-white px-4 rounded-r-lg hover:bg-green-600">Submit</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
