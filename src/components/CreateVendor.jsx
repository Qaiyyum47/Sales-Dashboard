import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateVendor = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [newVendor, setNewVendor] = useState({
        VendorName: '',
        ContactNumber: '',
        Address: '',
        Email: '',
        WebsiteURL: '',
        EstablishedYear: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewVendor({ ...newVendor, [name]: value });
    };

    const addVendor = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/vendors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newVendor)
            });
            if (!response.ok) throw new Error('Failed to add vendor');

            // Clear the form after a successful addition
            setNewVendor({
                VendorName: '',
                ContactNumber: '',
                Address: '',
                Email: '',
                WebsiteURL: '',
                EstablishedYear: ''
            });

            // Redirect to the vendor page
            navigate('/vendors');
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="m-auto bg-white p-4 rounded-lg shadow-md flex-grow w-3/6 ">
            <h2 className="text-2xl font-bold mb-4">Add New Vendor</h2>
            <form 
                className="flex flex-col gap-4" 
                onSubmit={(e) => { e.preventDefault(); addVendor(); }}
            >
                <input 
                    type="text" 
                    name="VendorName" 
                    placeholder="Vendor Name" 
                    className="border p-2 rounded"
                    value={newVendor.VendorName} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="ContactNumber" 
                    placeholder="Contact Number" 
                    className="border p-2 rounded"
                    value={newVendor.ContactNumber} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="Address" 
                    placeholder="Address" 
                    className="border p-2 rounded" 
                    value={newVendor.Address} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="email" 
                    name="Email" 
                    placeholder="Email" 
                    className="border p-2 rounded" 
                    value={newVendor.Email} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="WebsiteURL" 
                    placeholder="Website URL" 
                    className="border p-2 rounded" 
                    value={newVendor.WebsiteURL} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="EstablishedYear" 
                    placeholder="Established Year" 
                    className="border p-2 rounded" 
                    value={newVendor.EstablishedYear} 
                    onChange={handleChange} 
                    required 
                />
                <button 
                    type="submit" 
                    className="bg-gray-800 rounded-full m-auto hover:bg-gray-700 text-white py-2 px-4 border shadow transition w-3/6"
                >
                    Add Vendor
                </button>
            </form>
        </div>
    );
};

export default CreateVendor;
