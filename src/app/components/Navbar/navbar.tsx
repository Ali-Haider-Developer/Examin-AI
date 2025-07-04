"use client"
import { useState } from 'react';
import { FaHome, FaUser, FaCog, FaSignOutAlt, FaBars, FaBell } from 'react-icons/fa';
import Link from 'next/link';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Project Name */}
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Examie-AI Logo" 
                className="h-8 w-8 mr-2"
              />
              <span className="text-xl font-bold text-gray-800">Examin-AI</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-500">Dashboard</Link>
              <Link href="/exams" className="text-gray-600 hover:text-blue-500">Exams</Link>
              <Link href="/results" className="text-gray-600 hover:text-blue-500">Results</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <button 
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
              <FaHome />
              <span>Dashboard</span>
            </Link>
            <Link href="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
              <FaUser />
              <span>Profile</span>
            </Link>
            <Link href="/settings" className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
              <FaCog />
              <span>Settings</span>
            </Link>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 w-full">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Navbar;
