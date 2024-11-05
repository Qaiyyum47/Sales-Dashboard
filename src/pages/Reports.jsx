// src/components/ReportsPage.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register necessary components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
);

const ReportsPage = () => {
    // Placeholder data for sales and inventory reports
    const salesData = [
        { date: '2024-01-01', amount: 150 },
        { date: '2024-01-02', amount: 200 },
        { date: '2024-01-03', amount: 250 },
        { date: '2024-01-04', amount: 300 },
        { date: '2024-01-05', amount: 400 },
    ];

    const inventoryData = [
        { productName: 'Product A', quantity: 50 },
        { productName: 'Product B', quantity: 20 },
        { productName: 'Product C', quantity: 75 },
        { productName: 'Product D', quantity: 10 },
    ];

    // Placeholder sales chart data
    const salesChartData = {
        labels: salesData.map(sale => sale.date),
        datasets: [
            {
                label: 'Sales Amount',
                data: salesData.map(sale => sale.amount),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    // Placeholder inventory chart data
    const inventoryChartData = {
        labels: inventoryData.map(item => item.productName),
        datasets: [
            {
                label: 'Inventory Level',
                data: inventoryData.map(item => item.quantity),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Reports</h1>

            {/* Parent container for the reports */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                {/* Sales Reports Section */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-3">Sales Reports</h2>
                    <p>Sales data is available for the past week:</p>
                    <div className="flex items-center justify-center mt-4">
                        <div className="h-96 w-2/3 flex items-center justify-center">
                            <Line data={salesChartData} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Inventory Reports Section */}
            <div className="bg-white p-4 rounded-lg shadow-md mt-6">
                <h2 className="text-2xl font-semibold mb-3">Inventory Reports</h2>
                <p>Current inventory levels:</p>
                <div className="flex items-center justify-center mt-4">
                    <div className="h-96 w-2/3 flex items-center justify-center mb-10">
                        <Line data={inventoryChartData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
