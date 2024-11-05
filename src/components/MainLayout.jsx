// src/components/MainLayout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children }) => {
     // Sample user data
     // 
     const userProfile = {
        profilePicture: 'src/assets/img/download.jpg', // replace with your profile picture URL
        userName: 'Nakamura Kazuha' // replace with actual user name
    };
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
            <Header profilePicture={userProfile.profilePicture} userName={userProfile.userName} />
                {children}
            </div>
        </div>
    );
};

export default MainLayout;
