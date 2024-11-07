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

    // Validate input
    if (!SalesmanName || !ContactNumber || !Email || !Department || !HireDate || !CommissionRate) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = `
        INSERT INTO Salesman (SalesmanName, ContactNumber, Email, Department, HireDate, CommissionRate)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [SalesmanName, ContactNumber, Email, Department, HireDate, CommissionRate], (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to add salesman", details: err.message });
        res.status(201).json({ message: 'Salesman added successfully', id: results.insertId });
    });
});

// Update salesman details
router.put('/:id', (req, res) => {
    const salesmanId = req.params.id;  // Corrected to use SalesmanID
    const { SalesmanName, ContactNumber, Email, Department, HireDate, CommissionRate } = req.body;

    // Validate input
    if (!SalesmanName || !ContactNumber || !Email || !Department || !HireDate || !CommissionRate) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = `
        UPDATE Salesman 
        SET SalesmanName = ?, ContactNumber = ?, Email = ?, Department = ?, HireDate = ?, CommissionRate = ? 
        WHERE SalesmanID = ?
    `;
    db.query(query, [SalesmanName, ContactNumber, Email, Department, HireDate, CommissionRate, salesmanId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Salesman not found' });
        res.json({ message: 'Salesman updated successfully' });
    });
});

// Delete a salesman
router.delete('/:id', (req, res) => {
    const salesmanId = req.params.id;  // Corrected to use SalesmanID
    db.query('DELETE FROM Salesman WHERE SalesmanID = ?', [salesmanId], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to delete salesman", details: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Salesman not found" });
        res.status(204).send();
    });
});

export default router;
