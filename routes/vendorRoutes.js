// routes/vendorRoutes.js
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

// Backend: Route to get vendors with their total stock
router.get('/', (req, res) => {
    db.query(`
        SELECT 
            v.VendorName, 
            v.ContactNumber, 
            v.Address, 
            v.Email, 
            v.WebsiteURL, 
            v.EstablishedYear, 
            IFNULL(SUM(p.StockQuantity), 0) AS TotalStock
        FROM Vendors v
        LEFT JOIN Products p ON v.VendorID = p.VendorID
        GROUP BY v.VendorName, v.ContactNumber, v.Address, v.Email, v.WebsiteURL, v.EstablishedYear
    `, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


// Add a vendor
router.post('/', (req, res) => {
    const { VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear } = req.body;
    const query = 'INSERT INTO Vendors (VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear], (err, results) => {
        if (err) return res.status(500).json({ message: 'Failed to add vendor', error: err.message });
        res.status(201).json({ id: results.insertId, VendorName });
    });
});

// Update vendor
router.put('/:id', (req, res) => {
    const vendorId = req.params.id;
    const { VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear } = req.body;
    const query = 'UPDATE Vendors SET VendorName = ?, ContactNumber = ?, Address = ?, Email = ?, WebsiteURL = ?, EstablishedYear = ? WHERE VendorID = ?';

    db.query(query, [VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear, vendorId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Vendor not found' });
        res.json({ message: 'Vendor updated successfully' });
    });
});

// Delete vendor
router.delete('/:id', (req, res) => {
    const vendorId = req.params.id;
    db.query('DELETE FROM vendors WHERE VendorID = ?', [vendorId], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to delete vendor" });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Vendor not found" });
        res.status(204).send();
    });
});

export default router;
