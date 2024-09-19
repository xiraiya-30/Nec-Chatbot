import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewChats = () => {
  const [chats, setChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/get_chats')
      .then(response => {
        setChats(response.data);
      })
      .catch(error => {
        console.error('Error fetching chat history:', error);
      });
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex h-screen m-0 relative">
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        {chats.map(chat => (
          <div key={chat._id} onClick={() => handleUserClick(chat.user)} className={`cursor-pointer p-2 hover:bg-gray-200 rounded-lg ${chat.user === selectedUser ? 'font-extrabold bg-slate-300' : ''}`}>
            {chat.user}
          </div>
        ))}
      </div>
      <div className="w-max-3/4 w-3/4 bg-white p-4 overflow-y-auto static">
      <div className='absolute -top-1 border-b-2 bg-white border-black w-full px-10 py-2 '>

      <h2 className="text-xl font-bold ">{selectedUser}</h2>
      </div>

        {selectedUser ? (
          <>
            {chats.find(chat => chat.user === selectedUser).chats.map((message, index) => (
              <div key={index} className={`flex my-8 p-2 rounded-lg ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${message.sender === 'user' ? 'bg-blue-100' : 'bg-gray-200'} max-w-xs p-2 rounded-lg`}>
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>Select a user to view their chat history</p>
        )}
      </div>
    </div>
  );
};

export default ViewChats;
