// src/components/RemoveVendor.jsx
import React from 'react';

const RemoveVendor = ({ onClose, onConfirm, vendorName }) => {
    return (
        <div className="bg-black bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h3 className="text-xl mb-4 text-center">Are you sure you want to remove "{vendorName}"?</h3>
                <div className="flex flex-col justify-center gap-4">
                    <button 
                        onClick={onConfirm}  // Pass onConfirm directly
                        className="bg-gray-800 rounded-lg mx-auto hover:bg-red-600 text-white py-2 px-4 border shadow transition w-2/3"
                    >
                        Remove
                    </button>
                    <button 
                        onClick={onClose} 
                        className="bg-gray-300 rounded-lg mx-auto text-gray-800 py-2 px-4 hover:bg-gray-400 shadow transition w-2/3"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RemoveVendor;
