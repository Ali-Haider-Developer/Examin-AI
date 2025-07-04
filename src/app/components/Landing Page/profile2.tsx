'use client'
import { useState } from 'react';
import { FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import Link from 'next/link';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-green-50 transition-colors duration-200"
      >
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
          <FaUser className="text-white" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">John Doe</p>
            <p className="text-sm text-gray-500">john@example.com</p>
          </div>

          <Link href="/Profile">
            <div className="px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer">
              <FaCog className="text-gray-500" />
              <span className="text-sm text-gray-700">Dashboard</span>
            </div>
          </Link>

          <button
            onClick={() => {
              // Add logout logic here
              console.log('Logging out...');
            }}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
          >
            <FaSignOutAlt className="text-gray-500" />
            <span className="text-sm text-gray-700">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
