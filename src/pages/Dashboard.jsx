// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie } from 'recharts';

const Dashboard = () => {
    const [totalRevenue, setTotalRevenue] = useState(null);
    const [monthRevenue, setMonthRevenue] = useState(null);
    const [itemSold, setItemSold] = useState(null);
    const [totalStockQuantity, setTotalStockQuantity] = useState(0);
    const [productInventoryData, setProductInventoryData] = useState([]);
    const [revenuePercentage, setRevenuePercentage] = useState(null);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/revenue'); // Adjust the API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch revenue');
                }
                const data = await response.json();

                if (data.length > 0) {
                    // Setting the total revenue and item sold
                    setTotalRevenue(data[0].TotalRevenue);
                    setItemSold(data[0].ItemSold);

                    // Setting the month revenue to the last month's data
                    setMonthRevenue(data[data.length - 1].MonthRevenue);

                    // Getting the revenue percentage of the last data entry
                    setRevenuePercentage(data[data.length - 1].RevenuePercentage);

                    // Transform data for the chart
                    const formattedData = data.map(item => {
                        const date = new Date(item.Date);
                        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        const month = monthNames[date.getMonth()];

                        return {
                            name: month,
                            value: item.MonthRevenue,
                            percentage: item.RevenuePercentage,
                        };
                    });

                    setData(formattedData); // Set the data for the chart
                }
            } catch (error) {
                console.error("Error fetching revenue:", error);
                setError(error.message);
            }
        };

        fetchRevenue();
    }, []);

    if (error) return <div>Error: {error}</div>;

    useEffect(() => {
        const fetchTotalProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/inventory');
                if (!response.ok) {
                    throw new Error('Failed to fetch total products');
                }
                const data = await response.json();
    
                // Log the response to verify structure
                console.log("API Response:", data);
    
                // Set TotalStockQuantity
                if (data.products.length > 0) {
                    setTotalStockQuantity(data.products[0].TotalStockQuantity); // Use the first product's TotalStockQuantity
                } else {
                    setTotalStockQuantity(0); // Fallback if no products are returned
                }
    
                // Store inventory data (total stock per category)
                if (Array.isArray(data.inventory)) {
                    setProductInventoryData(data.inventory);
                } else {
                    throw new Error("Inventory data is not in expected format");
                }
            } catch (error) {
                console.error("Error fetching total products:", error);
                setError(error.message);
                setTotalStockQuantity(0); // Handle error
                setProductInventoryData([]); // Clear inventory data on error
            }
        };
    
        fetchTotalProducts();
    }, []);
    
    
    
    
    
    return (
        <div className="flex flex-col p-4 h-screen">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <h1 className=" my-4 text-2xl font-bold">Inventory & Revenue Dashboard</h1>
            {/* Stat Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="square bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-gray-700 text-lg">Total Revenue</h3>
                    </div>
                    <h2 className="text-2xl font-bold">
                        {error ? "Error loading revenue" : totalRevenue !== null ? `$${totalRevenue.toLocaleString()}` : "Loading..."}
                    </h2>
                </div>

                <div className="square bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-gray-700 text-lg">Month Revenue</h3>
                        <span className="text-green-500 text-sm">
                        {error ? "Error loading revenue" : revenuePercentage !== null ? `${revenuePercentage.toLocaleString()}%` : "Loading..."}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold">
                        {error ? "Error loading month revenue" : monthRevenue !== null ? `$${monthRevenue.toLocaleString()}` : "Loading..."}
                    </h2>
                </div>

                <div className="square bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-gray-700 text-lg">Total Available Product</h3>
                    </div>
                    <h2 className="text-2xl font-bold">
                     {error ? "Error loading total stock quantity" :totalStockQuantity  !== null ? `${totalStockQuantity} units` : "Loading..."}
                    </h2>

                </div>

                <div className="square bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-gray-700 text-lg">Items Sold</h3>
                    </div>
                    <h2 className="text-2xl font-bold">
                    {error ? "Error loading revenue" : itemSold !== null ? `${itemSold}` : "Loading..."}
                    </h2>
                </div>
            </div>

            {/* Container for Analytics and List Card */}
<div className="flex flex-col md:flex-row mt-6 gap-4">
    {/* Analytics Square */}
    <div className="bg-white p-6 rounded-lg shadow-md flex-grow h-full">
        <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
        <p className="text-gray-600 mb-6">Analysis of current revenue performance over the months.</p>
        
        {/* Ensure ResponsiveContainer works well within your layout */}
        <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>



                {/* List Card */}
                <div className="bg-white p-4 rounded-lg shadow-md w-2/5 h-10/12">
                    <h2 className="text-xl font-semibold mb-3">Inventory</h2>
                    <p>Current stock available across all categories.</p>
                    {/* Pie Chart Section */}
                    <div className="bg-white w-full h-3/6">
                    <ResponsiveContainer width="95%" height={300}>
    <PieChart>
        <Pie 
            data={productInventoryData} 
            dataKey="stock" 
            nameKey="category" 
            outerRadius={100} 
            fill="#8884d8" 
            label
        />
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
