// src/App.js
import React, { useState } from 'react';
// import Chatbot from '../components/Chatbot'; // Adjust the import path as necessary
import { RiRobot3Line } from "react-icons/ri";
import Chatbot from '../components/ChatBot';
import { useNavigate } from 'react-router-dom';
function App() {
  const [isOpen, setIsOpen] = useState(false);

  

  return (

    <div>
       <iframe src="https://www.google.com/search?q=aavesham/" className='w-full h-screen'></iframe>
      <RiRobot3Line 
        className="m-8 w-[5rem] h-[5rem] bg-[#61CE70] rounded-full p-3 border-4 border-black  cursor-pointer fixed bottom-4 right-4"
        onClick={() => setIsOpen(true)}
      />
      {/* <Chatbot */}
      
      <Chatbot isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}

export default App;
