// routes/customerRoutes.js
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

// Get all customers
router.get('/', (req, res) => {
    db.query('SELECT * FROM Customers', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add a new customer
router.post('/', (req, res) => {
    const { CustomerName, ContactNumber, Email, DateJoined, Address } = req.body;

    const query = `
        INSERT INTO Customers (CustomerName, ContactNumber, Email, DateJoined, Address)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [CustomerName, ContactNumber, Email, DateJoined, Address], (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to add customer" });
        res.status(201).json({ message: 'Customer added successfully', id: results.insertId });
    });
});

// Update customer details
router.put('/:customerName', (req, res) => {
    const { customerName } = req.params; // Use customerName from the URL
    const { ContactNumber, Email, DateJoined, Address } = req.body;

    const query = `
        UPDATE Customers 
        SET ContactNumber = ?, Email = ?, DateJoined = ?, Address = ? 
        WHERE CustomerName = ?
    `;
    db.query(query, [ContactNumber, Email, DateJoined, Address, customerName], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Customer not found' });
        res.json({ message: 'Customer updated successfully' });
    });
});

// Delete customer
router.delete('/:customerName', (req, res) => {
    const { customerName } = req.params; // Use customerName from the URL
    db.query('DELETE FROM Customers WHERE CustomerName = ?', [customerName], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to delete customer" });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Customer not found" });
        res.status(204).send();
    });
});

export default router;
