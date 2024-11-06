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

    // Query to insert vendor data into the database
    const query = `
        INSERT INTO Vendors 
        (VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to add vendor', error: err.message });
        }

        // Return success response with vendor ID and name
        res.status(201).json({ message: 'Vendor added successfully', id: results.insertId, VendorName });
    });
});

// Update a vendor
router.put('/:id', (req, res) => {
    const vendorId = req.params.id;
    const { VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear } = req.body;

    // Query to update vendor data in the database
    const query = `
        UPDATE Vendors 
        SET VendorName = ?, ContactNumber = ?, Address = ?, Email = ?, WebsiteURL = ?, EstablishedYear = ? 
        WHERE VendorID = ?
    `;

    db.query(query, [VendorName, ContactNumber, Address, Email, WebsiteURL, EstablishedYear, vendorId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Failed to update vendor', error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Vendor not found' });

        // Return success response
        res.json({ message: 'Vendor updated successfully' });
    });
});

// Delete a vendor
router.delete('/:id', (req, res) => {
    const vendorId = req.params.id;

    // Query to delete vendor from the database
    db.query('DELETE FROM Vendors WHERE VendorID = ?', [vendorId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to delete vendor', error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Vendor not found' });

        // Return success response for deletion
        res.status(204).send();
    });
});


export default router;
