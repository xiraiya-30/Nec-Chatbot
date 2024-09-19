import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import UpdateDB from './UpdateDB';
import ViewChats from './ViewChats';
import { RiRobot3Line } from "react-icons/ri";
import Dashboard from './Dashboard';

const AdminPage = () => {
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path ? 'text-black font-bold border-black border-b-2 px-4' : 'text-gray-700 hover:text-black px-4';
  };

  return (
    <div>
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 ">
            <RiRobot3Line className="h-8 w-auto" />
            <span className="text-xl font-bold">NEC Chatbot Admin Panel</span>
          </div>
          <div className="flex space-x-24">
            <Link to="/admin/dashboard" className={getLinkClass('/admin/dashboard')}>Home</Link>
            <Link to="/admin/updatedb" className={getLinkClass('/admin/updatedb')}>Update DB</Link>
            <Link to="/admin/viewchats" className={getLinkClass('/admin/viewchats')}>View Chats</Link>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-4">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="updatedb" element={<UpdateDB />} />
          <Route path="viewchats" element={<ViewChats />} />
          <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;
