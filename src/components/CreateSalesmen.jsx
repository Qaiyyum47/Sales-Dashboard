// src/components/CreateSalesmen.jsx
import React, { useState, useEffect } from 'react';

const CreateSalesmen = ({ onClose }) => {
    const [newSalesman, setNewSalesman] = useState({
        SalesmanName: '',
        ContactNumber: '',
        Email: '',
        Department: '',
        HireDate: '',
        CommissionRate: '',
    });

    // Fetch salesmen when the component mounts (if needed)
    useEffect(() => {
        // Fetching logic can go here (if necessary)
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSalesman({ ...newSalesman, [name]: value });
    };

    const addSalesman = async () => {
        // Filter out empty fields before submitting
        const salesmanToSubmit = { ...newSalesman };
        for (let key in salesmanToSubmit) {
            if (!salesmanToSubmit[key]) delete salesmanToSubmit[key];
        }

        console.log("Submitting Salesman Data:", salesmanToSubmit);

        try {
            const response = await fetch('http://localhost:5000/api/salesmen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(salesmanToSubmit)
            });

            if (!response.ok) throw new Error('Failed to add salesman');

            // Reset form fields after successful submission
            setNewSalesman({
                SalesmanName: '',
                ContactNumber: '',
                Email: '',
                Department: '',
                HireDate: '',
                CommissionRate: '',
            });

            onClose(); // Close modal
            window.location.reload(); // Reload page to reflect new salesman
        } catch (error) {
            console.error('Error in addSalesman:', error.message);
        }
    };

    return (
        <div className="m-auto bg-white p-6 rounded-lg shadow-lg flex-grow w-96 h-auto border-gray-300 border">
            <h2 className="text-2xl font-bold mb-4 text-center">Add New Salesman</h2>
            <form 
                className="flex flex-col gap-4" 
                onSubmit={(e) => { 
                    e.preventDefault(); 
                    addSalesman(); 
                }}
            >
                {/* Salesman Name */}
                <input 
                    type="text" 
                    name="SalesmanName" 
                    placeholder="Salesman Name" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800"
                    value={newSalesman.SalesmanName} 
                    onChange={handleChange} 
                    required 
                />

                {/* Contact Number */}
                <input 
                    type="text" 
                    name="ContactNumber" 
                    placeholder="Contact Number" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800"
                    value={newSalesman.ContactNumber} 
                    onChange={handleChange} 
                    required 
                />

                {/* Email */}
                <input 
                    type="email" 
                    name="Email" 
                    placeholder="Email" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800"
                    value={newSalesman.Email} 
                    onChange={handleChange} 
                    required 
                />

                {/* Department */}
                <input 
                    type="text" 
                    name="Department" 
                    placeholder="Department" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800"
                    value={newSalesman.Department} 
                    onChange={handleChange} 
                    required 
                />

                {/* Hire Date */}
                <input 
                    type="date" 
                    name="HireDate" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800"
                    value={newSalesman.HireDate} 
                    onChange={handleChange} 
                    required 
                />

                {/* Commission Rate */}
                <input 
                    type="number" 
                    name="CommissionRate" 
                    placeholder="Commission Rate" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800"
                    value={newSalesman.CommissionRate} 
                    onChange={handleChange} 
                    required 
                />

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="bg-gray-800 rounded-lg m-auto hover:bg-gray-700 text-white py-2 px-4 border shadow transition w-full"
                >
                    Add Salesman
                </button>
            </form>
        </div>
    );
};

export default CreateSalesmen;
