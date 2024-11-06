// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie } from 'recharts';


const Dashboard = () => {
    const [totalRevenue, setTotalRevenue] = useState(null);
    const [todayRevenue, setTodayRevenue] = useState(null);
    const [error, setError] = useState(null);
    // Sample data for the analytics chart
    const data = [
        { name: 'Jan', value: 4000 },
        { name: 'Feb', value: 3000 },
        { name: 'Mar', value: 2000 },
        { name: 'Apr', value: 2780 },
        { name: 'May', value: 1890 },
        { name: 'Jun', value: 2390 },
        { name: 'Jul', value: 3490 },
    ];
        // Sample data for the pie chart
        const pieData = [
            { name: 'Laptops', value: 400 },
            { name: 'Desktops', value: 200 },
            { name: 'Accesories', value: 100 },
            { name: 'Components', value: 20 },
            { name: 'Monitors', value: 50}
        ];
        
        useEffect(() => {
            const fetchRevenue = async () => {
                try {
                    const response = await fetch('http://localhost:5000/api/revenue'); // Adjust the API endpoint
                    if (!response.ok) {
                        throw new Error('Failed to fetch revenue');
                    }
                    const data = await response.json();
                    setTotalRevenue(data.TotalRevenue); // Assuming the API returns { TotalRevenue, TodayRevenue }
                    setTodayRevenue(data.TodayRevenue);
                } catch (error) {
                    console.error("Error fetching revenue:", error);
                    setError(error.message);
                }
            };
    
            fetchRevenue();
        }, []);

        useEffect(() => {
            const fetchData = async () => {
                try {
                    // Fetch products and inventory data from the backend
                    const response = await fetch("http://localhost:5000/api/products");
                    if (!response.ok) {
                        throw new Error("Failed to fetch products");
                    }
                    const data = await response.json();
        
                    console.log("Fetched Data:", data); // Log the fetched data for debugging
        
                    // Make sure the data is in the expected format
                    if (Array.isArray(data.products)) {
                        setProducts(data.products);  // Store detailed product data
                    } else {
                        throw new Error("Products data is not in expected format");
                    }
        
                    // Store inventory data (total stock per category)
                    if (Array.isArray(data.inventory)) {
                        setProductInventoryData(data.inventory);
                    } else {
                        throw new Error("Inventory data is not in expected format");
                    }
        
                } catch (error) {
                    setError(error.message);
                    console.error("Error fetching data:", error);
                }
            };
        
            fetchData();
        }, []);
        
    return (
        <div className="flex flex-col p-4 h-screen">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            
            
            {/* Stat Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="square bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-gray-700 text-lg">Total Revenue</h3>
                        <span className="text-green-500 text-sm">16%</span>
                    </div>
                    <h2 className="text-2xl font-bold">
                    {error ? "Error loading revenue" : totalRevenue !== null ? `$${totalRevenue.toLocaleString()}` : "Loading..."}
                    </h2>
                </div>

                <div className="square bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-gray-700 text-lg">Today Revenue</h3>
                        <span className="text-green-500 text-sm">3%</span>
                    </div>
                    <h2 className="text-2xl font-bold">
                    {error ? "Error loading today revenue" : todayRevenue !== null ? `$${todayRevenue.toLocaleString()}` : "Loading..."}
                    </h2>
                </div>

                <div className="square bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-gray-700 text-lg">Total Products</h3>
                        <span className="text-green-500 text-sm">23%</span>
                    </div>
                    <h2 className="text-2xl font-bold">235</h2>
                </div>

                <div className="square bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-gray-700 text-lg">Items Sold</h3>
                        <span className="text-green-500 text-sm">5%</span>
                    </div>
                    <h2 className="text-2xl font-bold">125</h2>
                </div>
            </div>

            {/* Container for Analytics and List Card */}
            <div className="flex flex-grow mt-6 gap-4">
                {/* Analytics Square */}
                <div className="bg-white p-4 rounded-lg shadow-md flex-grow h-5/6">
                    <h2 className="text-xl font-semibold mb-3">Analytics</h2>
                    <p className="mb-6">Analysis of current revenue.</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                
                {/* List Card */}
                <div className="bg-white p-4 rounded-lg shadow-md w-2/5 h-5/6">
                    <h2 className="text-xl font-semibold mb-3">Performance</h2>
                    <p>Each category performance</p>
                    {/* Pie Chart Section */}
                <div className="bg-white  w-full h-3/6">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                </div>
                
            </div>
        </div>
    );
};

export default Dashboard;
