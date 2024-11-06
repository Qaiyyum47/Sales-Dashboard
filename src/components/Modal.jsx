import React from 'react';

const Modal = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="relative">
                <button 
                    className="absolute top-0 right-0 text-gray-300 hover:text-gray-400 p-2"
                    onClick={onClose}
                >
                    &#10005; {/* X close button */}
                </button>
                <div className="text-center">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
