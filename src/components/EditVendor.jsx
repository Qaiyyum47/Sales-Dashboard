import React, { useState, useEffect } from 'react';

const EditVendor = ({ vendor, onClose }) => {
    const [updatedVendor, setUpdatedVendor] = useState({
        VendorName: '',
        ContactNumber: '',
        Address: '',
        Email: '',
        WebsiteURL: '',
        EstablishedYear: ''
    });

    useEffect(() => {
        if (vendor) {
            // Set the initial state from the provided vendor prop
            setUpdatedVendor({
                VendorName: vendor.VendorName || '',
                ContactNumber: vendor.ContactNumber || '',
                Address: vendor.Address || '',
                Email: vendor.Email || '',
                WebsiteURL: vendor.WebsiteURL || '',
                EstablishedYear: vendor.EstablishedYear || ''
            });
        }
    }, [vendor]); // Dependency array ensures this runs only when vendor changes

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedVendor((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    // Function to save vendor changes
    const saveVendor = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/vendors/${vendor.VendorID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedVendor)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to update vendor:', errorData);
                alert(errorData.message || 'Failed to update vendor. Please try again.');
                return;
            }

            // Close the modal after saving
            onClose();
            window.location.reload(); // Optional: refresh the page to see updated vendor
        } catch (error) {
            console.error('Error updating vendor:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="m-auto bg-white p-6 rounded-lg shadow-lg flex-grow w-96 h-auto border-gray-300 border">
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Vendor</h2>
            <form 
                className="flex flex-col gap-4" 
                onSubmit={(e) => { 
                    e.preventDefault(); 
                    saveVendor(); 
                }}
            >
                <input 
                    type="text" 
                    name="VendorName" 
                    placeholder="Vendor Name" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800"
                    value={updatedVendor.VendorName} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="ContactNumber" 
                    placeholder="Contact Number" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={updatedVendor.ContactNumber} 
                    onChange={handleChange} 
                    required 
                />
                <textarea 
                    name="Address" 
                    placeholder="Address" 
                    className="border p-2 rounded-lg shadow-sm h-24 focus:border-gray-800" 
                    value={updatedVendor.Address} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="email" 
                    name="Email" 
                    placeholder="Email" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={updatedVendor.Email} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="url" 
                    name="WebsiteURL" 
                    placeholder="Website URL" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={updatedVendor.WebsiteURL} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="EstablishedYear" 
                    placeholder="Established Year" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={updatedVendor.EstablishedYear} 
                    onChange={handleChange} 
                    required 
                />
                <button 
                    type="submit" 
                    className="bg-gray-800 rounded-lg m-auto hover:bg-gray-700 text-white py-2 px-4 border shadow transition w-full"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditVendor;
