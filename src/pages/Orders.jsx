import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true); // Start loading
            try {
                const response = await fetch('http://localhost:5000/api/orders');
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError(error.message);
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchOrders();
    }, []);

    // Filter orders based on the search term
    const filteredOrders = orders.filter(order => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
            order.Status?.toLowerCase().includes(lowerCaseSearchTerm) ||
            order.ShippingAddress?.toLowerCase().includes(lowerCaseSearchTerm)
        );
    });

    if (loading) {
        return <div className="text-center">Loading orders...</div>; // Loading message
    }

    return (
        <div className="overflow-x-auto p-5">
            <h1 className="text-3xl font-bold">Orders</h1>
            <div className="mt-4 flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">All Orders</h1>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search orders..." 
                        className="border rounded-full pl-10 pr-4 py-2 w-full md:w-64" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
            </div>

            <table className="shadow-md min-w-full border-collapse rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="py-3 px-4 text-left border-b border-gray-300">Order ID</th>
                        <th className="py-3 px-4 text-left border-b border-gray-300">Customer ID</th>
                        <th className="py-3 px-4 text-left border-b border-gray-300">Order Date</th>
                        <th className="py-3 px-4 text-left border-b border-gray-300">Status</th>
                        <th className="py-3 px-4 text-left border-b border-gray-300">Total Amount</th>
                        <th className="py-3 px-4 text-left border-b border-gray-300">Shipping Address</th>
                        <th className="py-3 px-4 text-left border-b border-gray-300">Invoice</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                            <tr key={order.OrderID} className="hover:bg-gray-100 transition-all duration-200">
                                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{order.OrderID}</td>
                                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{order.CustomerID}</td>
                                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{new Date(order.OrderDate).toLocaleDateString()}</td>
                                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{order.Status}</td>
                                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{Number(order.TotalAmount).toFixed(2)}</td>
                                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{order.ShippingAddress}</td>
                                <td className="py-4 px-4 border-b border-gray-300 text-blue-600">
                                <Link to={`/invoice`}>Check</Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-4 text-gray-800">No orders found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
    );
};

export default Orders;
