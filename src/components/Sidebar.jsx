import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdCompareArrows,
} from 'react-icons/md';
import {
  FaUsers,
  FaCarSide,
  FaClipboardList,
  FaBars,
  FaTimes,
  FaListUl,
} from 'react-icons/fa';
import { FaBell } from 'react-icons/fa6';

const navItems = [
  { to: '/', label: 'Dashboard', icon: <MdDashboard /> },
  { to: '/users', label: 'User Management', icon: <FaUsers /> },
  { to: '/drivers', label: 'Driver Management', icon: <FaCarSide /> },
  { to: '/bookings', label: 'Booking Management', icon: <FaClipboardList /> },
  { to: '/transactions', label: 'Transactions', icon: <MdCompareArrows /> },
  { to: '/categories', label: 'Categories', icon: <FaListUl  /> },
  { to: '/send-notification', label: 'Send Notification', icon: <FaBell  /> },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  // Optional: Close sidebar on screen resize if moved to large screen
  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth >= 1024;
      setIsLargeScreen(isLarge);
      if (isLarge) setIsOpen(false); // hide toggle state on large screens
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile & iPad Toggle Button */}
      {!isLargeScreen && (
        <div className="fixed top-4 left-4 z-50 lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl text-black p-2"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 bg-white border-r shadow transition-transform duration-300
          w-[70vw] sm:w-[60vw] md:w-[45vw] lg:w-[20vw]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
          flex flex-col
        `}
      >
        {/* Logo Section */}
        <div className="p-6 lg:p-8 flex justify-center">
          <img src="./Images/logo.png" alt="Logo" className="h-10" />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto flex flex-col space-y-2 p-4 lg:px-8">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => !isLargeScreen && setIsOpen(false)} // Close on mobile/iPad
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? 'bg-[#CDFF00] text-black'
                    : 'text-[#00000099] font-medium hover:bg-gray-100'
                }`
              }
            >
              <span className="text-xl">{icon}</span>
              <span className="text-[17px]">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
