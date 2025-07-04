"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaHome, FaBook, FaChartBar, FaSignOutAlt, FaBars, FaTimes, FaUpload, FaPlus, FaUser, FaHistory } from 'react-icons/fa';
import THEME from "../Landing Page/theme";
import Image from "next/image";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: <FaHome className="w-6 h-6" />, label: 'Dashboard', href: '/DashBoard' },
    { icon: <FaUpload className="w-6 h-6" />, label: 'Upload Content', href: '/ContentUpload' },
    { icon: <FaPlus className="w-6 h-6" />, label: 'Generate Exam', href: '/ContentUpload' },
    { icon: <FaHistory className="w-6 h-6" />, label: 'History', href: '/history' },
    { icon: <FaUser className="w-6 h-6" />, label: 'Profile', href: '/Profile' },
  ];

  const sidebarVariants = {
    expanded: { width: '240px' },
    collapsed: { width: '80px' }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-screen z-40 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ background: 'rgba(10,0,61,0.85)', borderRight: `2px solid ${THEME.accent1}`, boxShadow: `0 0 32px ${THEME.accent1}, 0 0 64px ${THEME.accent2}` }}
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        initial="expanded"
      >
        {/* Toggle Button */}
        <button
          className="hidden lg:block absolute -right-3 top-10 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] rounded-full p-1 text-black shadow-lg"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <FaBars size={16} /> : <FaTimes size={16} />}
        </button>

        {/* Logo & Branding */}
        <div className="p-6 border-b border-[#1a0066] flex items-center gap-3">
          <Image src="/logo.png" alt="Examin-AI Logo" width={36} height={36} style={{ filter: 'drop-shadow(0 0 8px #00fff7)' }} />
          {!isCollapsed && <span className="text-xl font-bold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent">Examin-AI</span>}
        </div>

        {/* Menu Items */}
        <nav className="p-4 mt-2">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href}>
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-4 text-[#e0e0ff] hover:text-black hover:bg-gradient-to-r hover:from-[#00fff7] hover:to-[#ff00ea] rounded-xl p-3 transition-all duration-200 border-2 border-transparent hover:border-[#00fff7]`}
                  >
                    {item.icon}
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </motion.div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-8 left-0 right-0 px-4">
          <motion.button 
            whileHover={{ x: 5 }}
            className="flex items-center gap-4 text-[#e0e0ff] hover:text-black hover:bg-gradient-to-r hover:from-[#ff00ea] hover:to-[#00fff7] rounded-xl p-3 w-full border-2 border-transparent hover:border-[#ff00ea] transition-all"
          >
            <FaSignOutAlt className="text-2xl" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
