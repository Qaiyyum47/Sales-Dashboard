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
    const { ProductName, Description, Price, StockQuantity, VendorID, CategoryID, ImageURL, SKU } = req.body;
    
    const query = `
        INSERT INTO Products 
        (ProductName, Description, Price, StockQuantity, VendorID, CategoryID, ImageURL, DateAdded, SKU) 
        VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), ?)
    `;

    db.query(
        query,
        [ProductName, Description, Price, StockQuantity, VendorID, CategoryID, ImageURL, SKU],
        (err, results) => {
            if (err) {
                console.error("Error inserting product:", err.message);
                return res.status(500).json({ error: "Failed to add product" });
            }
            res.status(201).json({ 
                message: 'Product added successfully', 
                id: results.insertId, 
                ProductName, 
                Description, 
                Price, 
                StockQuantity, 
                VendorID, 
                CategoryID, 
                ImageURL, 
                SKU 
            });
        }
    );
});


// Update product
app.put('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const { ProductName, Description, Price, StockQuantity, VendorID, CategoryID, ImageURL, DateAdded, SKU } = req.body;

    const query = `
        UPDATE products 
        SET ProductName = ?, Description = ?, Price = ?, StockQuantity = ?, VendorID = ?, 
            CategoryID = ?, ImageURL = ?, DateAdded = ?, SKU = ? 
        WHERE ProductID = ?`;

    db.query(
        query, 
        [ProductName, Description, Price, StockQuantity, VendorID, CategoryID, ImageURL, DateAdded, SKU, productId], 
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
            res.json({ message: 'Product updated successfully' });
        }
    );
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

// Get all vendors
app.get('/api/vendors', (req, res) => {
    db.query('SELECT * FROM vendors', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


// Add vendor
app.post('/api/vendors', (req, res) => {
    const { VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear } = req.body;
    const query = 'INSERT INTO Vendors (VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear], (err, results) => {
        if (err) {
            console.error('Error adding vendor:', err); // Log the error for debugging
            return res.status(500).json({ message: 'Failed to add vendor', error: err.message });
        }
        res.status(201).json({ id: results.insertId, VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear });
    });
});



// Update vendor
app.put('/api/vendors/:id', (req, res) => {
    const vendorId = req.params.id;
    const { VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear } = req.body;
    const query = 'UPDATE Vendors SET VendorName = ?, ContactNumber = ?, Address = ?, Email = ?, WebsiteURL = ?, EstablishedYear = ? WHERE VendorID = ?';

    db.query(query, [VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear, vendorId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Vendor not found' });
        res.json({ message: 'Vendor updated successfully' });
    });
});




app.post('/api/vendors', async (req, res) => {
    const { VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO Vendors (VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear]
        );
        
        res.status(201).json({ message: 'Vendor added successfully', vendorId: result.insertId });
    } catch (error) {
        console.error('Error adding vendor:', error); // Log the error for debugging
        res.status(500).json({ message: 'Failed to add vendor', error });
    }
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



// Endpoint to fetch all invoices with client and item details
app.get('/api/invoices', (req, res) => {
    const query = `
        SELECT 
    Invoices.InvoiceID,
    Invoices.InvoiceDate,
    Customers.CustomerName,
    Customers.ContactNumber,
    Customers.Email,
    Orders.OrderID,
    Orders.OrderDate,
    Orders.Status AS OrderStatus,
    Orders.TotalAmount AS OrderTotalAmount,
    Products.ProductName,
    Products.Description AS ProductDescription,
    Products.Price AS ProductPrice,
    InvoiceDetails.Quantity,
    (InvoiceDetails.Quantity * InvoiceDetails.Price) AS TotalLineAmount
FROM 
    Invoices
JOIN 
    Customers ON Invoices.CustomerID = Customers.CustomerID
JOIN 
    InvoiceDetails ON Invoices.InvoiceID = InvoiceDetails.InvoiceID
JOIN 
    Products ON InvoiceDetails.ProductID = Products.ProductID
JOIN 
    Orders ON Orders.CustomerID = Customers.CustomerID
WHERE 
    Orders.OrderDate = Invoices.InvoiceDate  -- Optional condition to match orders on the same day as invoice, if relevant
ORDER BY 
    Invoices.InvoiceID;

    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
