import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Vendors from './pages/Vendors';
import Customers from './pages/Customers';
import Salesmen from './pages/Salesmen';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import Invoice from './components/Invoice';
import Create from './components/Create';
import CreateVendor from './components/CreateVendor';
import CreateSalesmen from './components/CreateSalesmen';
import Remove from './components/Remove';
import RemoveVendor from './components/RemoveVendor';
import EditProduct from './components/EditProduct';
import EditVendor from './components/EditVendor';
import Modal from './components/Modal';

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
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/invoice" element={<Invoice />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/modal" element={<Modal />} />
                    <Route path="/remove" element={<Remove />} />
                    <Route path="/removevendor" element={<RemoveVendor />} />
                    <Route path="/editproduct" element={<EditProduct />} />
                    <Route path="/editvendor" element={<EditVendor />} />
                    <Route path="/createvendor" element={<CreateVendor />} />
                    <Route path="/createsalesmen" element={<CreateSalesmen />} />
                    {/* Default route to redirect to Dashboard */}
                    <Route path="/" element={<Dashboard />} />
                </Routes>
            </MainLayout>
        </Router>
    );
};

export default App;
