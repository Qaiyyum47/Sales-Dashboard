import express from 'express';
import mysql from 'mysql2';

const router = express.Router();

// Database connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'ecommercedb',
    decimalNumbers: true,
});

// Check database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1); // Exit if DB connection fails
    }
    console.log('Connected to the database');
});

// Backend: Route to get vendors with their total stock
router.get('/', (req, res) => {
    const query = `
        SELECT 
            v.VendorID,
            v.VendorName, 
            v.ContactNumber, 
            v.Address, 
            v.Email, 
            v.WebsiteURL, 
            v.EstablishedYear, 
            v.AmountOfPackages, 
            v.ShippingStatus, 
            IFNULL(SUM(p.StockQuantity), 0) AS TotalStock
        FROM Vendors v
        LEFT JOIN Products p ON v.VendorID = p.VendorID
        GROUP BY v.VendorID, v.VendorName, v.ContactNumber, v.Address, v.Email, v.WebsiteURL, v.EstablishedYear
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching vendors', details: err.message });
        }
        res.json(results);
    });
});

// Add a vendor
router.post('/', (req, res) => {
    const { VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear } = req.body;

    // Validate input
    if (!VendorName || !ContactNumber || !Address || !Email || !WebsiteURL || !EstablishedYear) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = `
        INSERT INTO Vendors (VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to add vendor', error: err.message });
        }
        res.status(201).json({ message: 'Vendor added successfully', id: results.insertId, VendorName });
    });
});

// Update a vendor
router.put('/:id', (req, res) => {
    const vendorId = req.params.id;
    const { VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear } = req.body;

    // Validate input
    if (!VendorName || !ContactNumber || !Address || !Email || !WebsiteURL || !EstablishedYear) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = `
        UPDATE Vendors 
        SET VendorName = ?, ContactNumber = ?, Address = ?, Email = ?, WebsiteURL = ?, EstablishedYear = ?
        WHERE VendorID = ?
    `;

    db.query(query, [VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear, vendorId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to update vendor', error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.json({ message: 'Vendor updated successfully' });
    });
});

// Delete a vendor
router.delete('/:id', (req, res) => {
    const vendorId = req.params.id;

    const query = 'DELETE FROM Vendors WHERE VendorID = ?';

    db.query(query, [vendorId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to delete vendor', error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.status(204).send(); // No content
    });
});

export default router;
