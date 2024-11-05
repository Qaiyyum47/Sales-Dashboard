// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingBasket, FaBox, FaStar, FaUserFriends, FaUser, FaClipboard, FaChartPie, FaCog } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', icon: <MdDashboard />, path: '/dashboard' },
        { name: 'Products', icon: <FaBox />, path: '/products' },
        { name: 'Vendors', icon: <FaUserFriends />, path: '/vendors' },
        { name: 'Customers', icon: <FaUser />, path: '/customers' },
        { name: 'Salesman', icon: <FaClipboard />, path: '/salesmen' },
        { name: 'Orders', icon: <FaShoppingBasket />, path: '/orders' },
        { name: 'Reports', icon: <FaChartPie />, path: '/reports' },
    ];

    return (
        <div className="flex flex-col h-screen w-64 bg-gray-900 text-white p-4 shadow-lg">
            <div className="flex items-center mt-5 mb-5 text-center ">
                <FaStar className="h-8 w-8 mr-2" /> {/* Using FaStar as logo */}
                <span className="text-lg font-bold">PcWorld</span>
            </div>
            <hr className="border-t border-gray-600 mb-2" />
            <ul className="space-y-2 flex-grow pt-4">
                {navItems.map(({ name, icon, path }) => (
                    <li key={name}>
                        <Link
                            to={path}
                            className={`flex items-center py-3 px-4 rounded-lg transition-colors duration-200 
                                ${location.pathname === path ? 'bg-gray-700 text-indigo-300' : 'hover:bg-gray-800'}`}
                        >
                            {icon}
                            <span className="ml-3 text-base">{name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="mt-auto">
                <hr className="border-t border-gray-600 mb-2" />
                <Link
                    to="/settings"
                    className={`flex items-center py-3 px-4 rounded-lg transition-colors duration-200 
                        ${location.pathname === '/settings' ? 'bg-gray-700 text-indigo-300' : 'hover:bg-gray-800'}`}
                >
                    <FaCog />
                    <span className="ml-3 text-base">Settings</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
