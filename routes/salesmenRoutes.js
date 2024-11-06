// routes/salesmenRoutes.js
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

// Get all salesmen
router.get('/', (req, res) => {
    db.query('SELECT * FROM Salesman', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add a new salesman
router.post('/', (req, res) => {
    const { SalesmanName, ContactNumber, Email, Department, HireDate, CommissionRate } = req.body;

    const query = `
        INSERT INTO Salesman (SalesmanName, ContactNumber, Email, Department, HireDate, CommissionRate)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [SalesmanName, ContactNumber, Email, Department, HireDate, CommissionRate], (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to add salesman" });
        res.status(201).json({ message: 'Salesman added successfully', id: results.insertId });
    });
});

// Update salesman details
router.put('/:salesmanName', (req, res) => {
    const { SalesmanName } = req.params;  // Corrected the variable to match the route parameter
    const { ContactNumber, Email, Department, HireDate, CommissionRate } = req.body;

    const query = `
        UPDATE Salesman 
        SET ContactNumber = ?, Email = ?, Department = ?, HireDate = ?, CommissionRate = ? 
        WHERE SalesmanName = ?
    `;
    db.query(query, [ContactNumber, Email, Department, HireDate, CommissionRate, SalesmanName], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Salesman not found' });
        res.json({ message: 'Salesman updated successfully' });
    });
});

// Delete a salesman
router.delete('/:salesmanName', (req, res) => {
    const { salesmanName } = req.params;  // Corrected the variable to match the route parameter
    db.query('DELETE FROM Salesman WHERE SalesmanName = ?', [salesmanName], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to delete salesman" });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Salesman not found" });
        res.status(204).send();
    });
});

export default router;
