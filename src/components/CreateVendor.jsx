// src/components/CreateVendor.jsx
import React, { useState, useEffect } from 'react';

const CreateVendor = ({ onClose }) => {
    const [newVendor, setNewVendor] = useState({
        VendorName: '',
        ContactNumber: '',
        Address: '',
        Email: '',
        WebsiteURL: '',
        EstablishedYear: '',
    });

    // Fetch vendors when the component mounts (if needed)
    useEffect(() => {
        // Fetching logic can go here (if necessary)
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewVendor({ ...newVendor, [name]: value });
    };

    const addVendor = async () => {
        // Filter out empty fields before submitting
        const vendorToSubmit = { ...newVendor };
        for (let key in vendorToSubmit) {
            if (!vendorToSubmit[key]) delete vendorToSubmit[key];
        }

        console.log("Submitting Vendor Data:", vendorToSubmit);

        try {
            const response = await fetch('http://localhost:5000/api/vendors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vendorToSubmit)
            });

            if (!response.ok) throw new Error('Failed to add vendor');

            // Reset form fields after successful submission
            setNewVendor({
                VendorName: '',
                ContactNumber: '',
                Address: '',
                Email: '',
                WebsiteURL: '',
                EstablishedYear: '',
            });

            onClose(); // Close modal
            window.location.reload(); // Reload page to reflect new vendor
        } catch (error) {
            console.error('Error in addVendor:', error.message);
        }
    };

    return (
        <div className="m-auto bg-white p-6 rounded-lg shadow-lg flex-grow w-96 h-auto border-gray-300 border">
            <h2 className="text-2xl font-bold mb-4 text-center">Add New Vendor</h2>
            <form 
                className="flex flex-col gap-4" 
                onSubmit={(e) => { 
                    e.preventDefault(); 
                    addVendor(); 
                }}
            >
                {/* Vendor Name */}
                <input 
                    type="text" 
                    name="VendorName" 
                    placeholder="Vendor Name" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800"
                    value={newVendor.VendorName} 
                    onChange={handleChange} 
                    required 
                />

                {/* Contact Number */}
                <input 
                    type="text" 
                    name="ContactNumber" 
                    placeholder="Contact Number" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800"
                    value={newVendor.ContactNumber} 
                    onChange={handleChange} 
                    required 
                />

                {/* Address */}
                <textarea 
                    name="Address" 
                    placeholder="Address" 
                    className="border p-2 rounded-lg shadow-sm h-24 focus:border-gray-800"
                    value={newVendor.Address} 
                    onChange={handleChange} 
                    required 
                />

                {/* Email */}
                <input 
                    type="email" 
                    name="Email" 
                    placeholder="Email" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={newVendor.Email} 
                    onChange={handleChange} 
                    required 
                />

                {/* Website URL */}
                <input 
                    type="url" 
                    name="WebsiteURL" 
                    placeholder="Website URL" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={newVendor.WebsiteURL} 
                    onChange={handleChange} 
                />

                {/* Established Year */}
                <input 
                    type="number" 
                    name="EstablishedYear" 
                    placeholder="Established Year" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={newVendor.EstablishedYear} 
                    onChange={handleChange} 
                    required 
                />

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="bg-gray-800 rounded-lg m-auto hover:bg-gray-700 text-white py-2 px-4 border shadow transition w-full"
                >
                    Add Vendor
                </button>
            </form>
        </div>
    );
};

export default CreateVendor;
