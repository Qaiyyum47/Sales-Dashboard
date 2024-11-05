import React, { useEffect, useState } from 'react';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Vendors = () => {
    const [vendors, setVendors] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const [inventoryData, setInventoryData] = useState([
        { category: "Dell", stock: 120 },
        { category: "Asus", stock: 80 },
        { category: "Logitech", stock: 50 },
        { category: "Components", stock: 150 },
    ]);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/vendors'); // Adjust the API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch vendors');
                }
                const data = await response.json();
                setVendors(data);
            } catch (error) {
                console.error("Error fetching vendors:", error);
                setError(error.message);
            }
        };

        fetchVendors();
    }, []);

    // Filter vendors based on the search term
    const filteredVendors = vendors.filter(vendor => {
        return vendor.VendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               vendor.ContactNumber.includes(searchTerm) ||
               vendor.Email.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleRemove = async (vendorId) => {
        if (window.confirm("Are you sure you want to remove this vendor?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/vendors/${vendorId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete product');
                }

                setVendors((prevVendors) => prevVendors.filter(vendor => vendor.VendorID !== vendorId));
            } catch (error) {
                console.error("Error removing product:", error);
                setError(error.message);
            }
        }
    };

    return (
        <div className="overflow-x-auto p-5">
            <h1 className="text-3xl font-bold">Vendors</h1>
            <div className="mt-4 flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">All Vendors</h1>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => navigate('/createVendor')}
                        className="mr-4 bg-gray-800 rounded-full hover:bg-gray-700 text-white py-2 px-4 border shadow transition"
                    >
                        Add Vendor
                    </button>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            className="border rounded-full pl-10 pr-4 py-2 w-full md:w-64" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                </div>
            </div>


            <table className="shadow-md min-w-full border-collapse rounded-lg overflow-hidden">
    <thead className="bg-gray-800 text-white">
        <tr>
            <th className="py-3 px-4 text-left border-b border-gray-300">No.</th>
            <th className="py-3 px-4 text-left border-b border-gray-300">Name</th>
            <th className="py-3 px-4 text-left border-b border-gray-300">Contact Number</th>
            <th className="py-3 px-4 text-left border-b border-gray-300">Address</th>
            <th className="py-3 px-4 text-left border-b border-gray-300">Email</th>
            <th className="py-3 px-4 text-left border-b border-gray-300">Website</th>
            <th className="py-3 px-4 text-left border-b border-gray-300">Action</th>
        </tr>
    </thead>
    <tbody>
        {vendors.length > 0 ? (
            vendors.map((vendor, index) => (
                <tr key={vendor.VendorID}>
                    <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{index + 1}</td>
                    <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{vendor.VendorName}</td>
                    <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{vendor.ContactNumber}</td>
                    <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{vendor.Address}</td>
                    <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{vendor.Email}</td>
                    <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                        <a href={vendor.WebsiteURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{vendor.WebsiteURL}</a>
                    </td>
                    <td className="py-4 px-4 border-b border-gray-300 text-gray-800 space-x-4">
                        <button onClick={() => handleEdit(vendor.VendorID)} className="text-blue-500 hover:underline"><FaEdit /></button>
                        <button onClick={() => handleRemove(vendor.VendorID)} className="text-red-500 hover:underline"><FaTrash /></button>
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="7" className="text-center py-4 text-gray-800">No vendors found</td>
            </tr>
        )}
    </tbody>
</table>

{error && <div className="text-red-500 mt-4">{error}</div>}

<div className="flex flex-grow mt-6 gap-4">
    <div className="bg-white p-4 rounded-lg shadow-md flex-grow h-5/6">
        <h2 className="text-xl font-semibold mb-3">Inventory</h2>
        <p className="mb-6">Current stock levels across all categories.</p>
        <ResponsiveContainer width="95%" height={300}>
            <BarChart data={inventoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    </div>

    <div className="bg-white p-4 rounded-lg shadow-md w-2/5 h-10/12">
        <h2 className="text-xl font-semibold mb-3">Performance</h2>
        <p className="mb-6">Each category performance</p>

        {/* Vendor Orders Table */}
        <table className="shadow-md min-w-full border-collapse rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
                <tr>
                    <th className="py-3 px-4 text-left border-b border-gray-300">Order ID</th>
                    <th className="py-3 px-4 text-left border-b border-gray-300">Vendor</th>
                    <th className="py-3 px-4 text-left border-b border-gray-300">Status</th>
                </tr>
            </thead>
            <tbody className="bg-white">
                {/* Dummy Data */}
                {[
                    { id: '001', vendorName: 'Vendor A', status: 'Pending' },
                    { id: '002', vendorName: 'Vendor B', status: 'Completed' },
                    { id: '003', vendorName: 'Vendor C', status: 'Shipped' },
                ].map(order => (
                    <tr key={order.id} className="hover:bg-gray-100 transition-all duration-200">
                        <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{order.id}</td>
                        <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{order.vendorName}</td>
                        <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{order.status}</td>
                    </tr>
                ))}
                {/* If no orders were present, this line would display */}
                <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-800">No orders found</td>
                </tr>
            </tbody>
        </table>
                </div>
            </div>
        </div>
    );
};

export default Vendors;
