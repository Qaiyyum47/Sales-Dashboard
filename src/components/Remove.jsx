// src/components/Remove.jsx
import React from 'react';

const Remove = ({ onClose, onConfirm, productName }) => {
    return (
        <div className="bg-black bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h3 className="text-xl mb-4 text-center">Are you sure you want to remove "{productName}"?</h3>
                <div className="flex justify-center gap-4">
                    <button 
                        onClick={onClose} 
                        className="bg-gray-300 rounded-lg  text-gray-800 py-2 px-4 hover:bg-gray-400 shadow transition w-1/3"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="bg-gray-800 rounded-lg  hover:bg-red-600 text-white py-2 px-4 border shadow transition w-1/3"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Remove;
