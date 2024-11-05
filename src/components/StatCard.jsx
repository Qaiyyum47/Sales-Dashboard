// src/components/StatCard.jsx
import React from 'react';

const StatCard = ({ title, percentage, value }) => {
    return (
        <div className="bg-white p-4 rounded shadow-md text-center">
            <h3 className="text-gray-700 text-lg">{title}</h3>
            <span className="text-green-500 text-sm">{percentage}</span>
            <h2 className="text-2xl font-bold">{value}</h2>
        </div>
    );
};

export default StatCard;
