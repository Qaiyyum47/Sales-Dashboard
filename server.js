import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'ecommercedb',
    decimalNumbers: true,
});

// Test the database connection
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// API routes
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add product
app.post('/api/products', (req, res) => {
    const { ProductName, Price, StockQuantity, VendorID, CategoryID } = req.body;
    const query = 'INSERT INTO products (ProductName, Price, StockQuantity, VendorID, CategoryID) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [ProductName, Price, StockQuantity, VendorID, CategoryID], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, ProductName, Price, StockQuantity, VendorID, CategoryID });
    });
});

// Update product
app.put('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const { ProductName, Price, StockQuantity, VendorID, CategoryID } = req.body;
    const query = 'UPDATE products SET ProductName = ?, Price = ?, StockQuantity = ?, VendorID = ?, CategoryID = ? WHERE ProductID = ?';
    db.query(query, [ProductName, Price, StockQuantity, VendorID, CategoryID, productId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product updated successfully' });
    });
});

app.post('/api/products', async (req, res) => {
    const { ProductName, Description, Price, StockQuantity, VendorID, CategoryID, ImageURL, SKU } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO Products (ProductName, Description, Price, StockQuantity, VendorID, CategoryID, ImageURL, DateAdded, SKU) 
            VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), ?)`,
            [ProductName, Description, Price, StockQuantity, VendorID, CategoryID, ImageURL, SKU]
        );
        
        res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add product', error });
    }
});


// Delete a product by ID
app.delete('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    db.query('DELETE FROM products WHERE ProductID = ?', [productId], (err, result) => {
        if (err) {
            console.error("Error deleting product:", err);
            return res.status(500).json({ error: "Failed to delete product" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(204).send(); // No content to send back
    });
});

// Add a vendor
app.post('/api/vendors', async (req, res) => {
    const { VendorName, ContactName, ContactEmail, ContactPhone, Address } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO vendors (VendorName, ContactName, ContactEmail, ContactPhone, Address, DateAdded) 
            VALUES (?, ?, ?, ?, ?, CURDATE())`,
            [VendorName, ContactName, ContactEmail, ContactPhone, Address]
        );

        res.status(201).json({ message: 'Vendor added successfully', vendorId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add vendor', error });
    }
});

// Get all vendors
app.get('/api/vendors', (req, res) => {
    db.query('SELECT * FROM vendors', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get a vendor by ID
app.get('/api/vendors/:id', (req, res) => {
    const vendorId = req.params.id;
    db.query('SELECT * FROM vendors WHERE VendorID = ?', [vendorId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Vendor not found' });
        res.json(results[0]);
    });
});

// Update a vendor
app.put('/api/vendors/:id', (req, res) => {
    const vendorId = req.params.id;
    const { VendorName, ContactName, ContactEmail, ContactPhone, Address } = req.body;
    const query = 'UPDATE vendors SET VendorName = ?, ContactName = ?, ContactEmail = ?, ContactPhone = ?, Address = ? WHERE VendorID = ?';
    db.query(query, [VendorName, ContactName, ContactEmail, ContactPhone, Address, vendorId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Vendor not found' });
        res.json({ message: 'Vendor updated successfully' });
    });
});

// Delete a vendor by ID
app.delete('/api/vendors/:id', (req, res) => {
    const vendorId = req.params.id;
    db.query('DELETE FROM vendors WHERE VendorID = ?', [vendorId], (err, result) => {
        if (err) {
            console.error("Error deleting vendor:", err);
            return res.status(500).json({ error: "Failed to delete vendor" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Vendor not found" });
        }
        res.status(204).send(); // No content to send back
    });
});




app.get('/api/salesmen', (req, res) => {
    db.query('SELECT * FROM Salesman', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/customers', (req, res) => {
    db.query('SELECT * FROM Customers', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/orders', (req, res) => {
    db.query('SELECT * FROM Orders', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
