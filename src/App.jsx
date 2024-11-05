// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Vendors from './pages/Vendors';
import Customers from './pages/Customers';
import Salesmen from './pages/Salesmen';
import Orders from './pages/Orders';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Invoice from './components/Invoice';
import Create from './components/Create';
import CreateVendor from './components/CreateVendor';

const App = () => {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/vendors" element={<Vendors />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/salesmen" element={<Salesmen />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/invoice" element={<Invoice />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/createvendor" element={<CreateVendor />} />
                    {/* Default route to redirect to Dashboard */}
                    <Route path="/" element={<Dashboard />} />
                </Routes>
            </MainLayout>
        </Router>
    );
};

export default App;
