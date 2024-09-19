import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [chatData, setChatData] = useState({ today: 0, total: 0 });

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/get_chatcount');
        setChatData(response.data);
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    fetchChatData();
  }, []);


  const navigate=useNavigate()
  
  return (
    <div className="h-[80vh] max-h-screen flex align-middle items-center  overflow-hidden justify-center">
      <div className="p-8 -bottom-4 rounded-lg shadow-md m-w-3/4 w-2/4 text-center">
        <h1 className="text-xl font-bold mb-4 p-4">Admin Dashboard</h1>
        <div className="grid grid-cols-2 mb-6 border-2 border-gray-700">
          <div className=" p-4 border-x-[1px] border-b-slate-400">
            <h2 className="text-lg pb-3 ">Chats Today:</h2>
            <p className="text-5xl  font-light">{chatData.today}</p>
          </div>
          <div className=" p-4 border-x-[1px] border-b-slate-400">
            <h2 className="text-lg pb-3">Total Chats:</h2>
            <p className="text-5xl font-light">{chatData.total}</p>
          </div>
        </div>
        <div className="flex justify-center">
          <button className="bg-gray-200 m-3 min-w-32 border-2 border-gray-700 rounded-sm text-black px-4 py-2 rounded-l hover:bg-gray-300" onClickCapture={() => navigate('/admin/viewchats')} > View Chats</button>
          <button className="bg-gray-700 m-3 min-w-32 border-2 border-gray-700 rounded-sm text-white px-4 py-2 rounded-r hover:bg-gray-600" onClickCapture={() => navigate('/admin/updatedb')}>Update DB</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
