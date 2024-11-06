// server.js
import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import salesmenRoutes from './routes/salesmenRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import orderRoutes from './routes/orderRoutes.js';


const app = express();
app.use(cors());
app.use(express.json());  // Middleware for JSON body parsing

// Route setup
app.use('/api/products', productRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/salesmen', salesmenRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/orders', invoiceRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the E-Commerce API!');
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
