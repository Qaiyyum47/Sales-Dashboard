// src/components/Header.jsx
import React from 'react';
import { FaBell } from 'react-icons/fa'; 

const Header = ({ profilePicture, userName }) => {
    return (
        <header className="sticky top-0 mx-auto rounded bg-white shadow-md z-50 p-4 flex justify-end  items-center">
            <div className="flex items-center">
                <img src={profilePicture} alt="Profile" className="w-10 h-10 rounded-full mr-4" />
                <h2 className="text-lg font-semibold">{userName}</h2>
                <div className="ml-4">
                    <FaBell className="fill-gray-800 text-xl cursor-pointer hover:fill-gray-700"/> {/* Notification icon */}
                </div>
            </div>
        </header>
    );
};

export default Header;
