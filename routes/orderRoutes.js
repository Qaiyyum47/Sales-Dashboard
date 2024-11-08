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
    db.query(`
        SELECT 
    c.CustomerName AS CustomerName,
    c.ContactNumber AS ContactNumber,
    c.Email AS EmailAddress,
    c.Address AS Address,
    i.InvoiceID AS InvoiceID,
    i.InvoiceDate AS InvoiceDate,
    o.OrderID AS OrderID,
    o.OrderDate AS OrderDate,
    o.Status AS OrderStatus,
    o.TotalAmount AS TotalOrderAmount,
    i.SalesmanID AS SalesmanID,
    p.ProductName AS ProductName,
    id.Quantity AS Quantity,
    id.Price AS ProductPrice,
    (id.Quantity * id.Price) AS TotalLineAmount
FROM 
    Customers c
JOIN 
    Invoices i ON c.CustomerID = i.CustomerID
JOIN 
    InvoiceDetails id ON i.InvoiceID = id.InvoiceID
JOIN 
    Products p ON id.ProductID = p.ProductID
JOIN 
    Orders o ON c.CustomerID = o.CustomerID;`
        , (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add a new order
router.post('/', (req, res) => {
    const { CustomerID, Status, TotalAmount, ShippingAddress } = req.body;

    const query = `
        INSERT INTO Orders (CustomerID, OrderDate, Status, TotalAmount, ShippingAddress)
        VALUES (?, CURDATE(), ?, ?, ?)
    `;
    db.query(query, [CustomerID, Status, TotalAmount, ShippingAddress], (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to add order" });
        res.status(201).json({ message: 'Order added successfully', id: results.insertId });
    });
});

// Update an order
router.put('/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    const { Status, TotalAmount, ShippingAddress } = req.body;

    const query = `
        UPDATE Orders
        SET Status = ?, TotalAmount = ?, ShippingAddress = ?
        WHERE OrderID = ?
    `;
    db.query(query, [Status, TotalAmount, ShippingAddress, orderId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });
        res.json({ message: 'Order updated successfully' });
    });
});

// Delete an order
router.delete('/:orderId', (req, res) => {
    const orderId = req.params.orderId;

    const query = `DELETE FROM Orders WHERE OrderID = ?`;
    db.query(query, [orderId], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to delete order" });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Order not found" });
        res.status(204).send();  // No content response for successful deletion
    });
});


export default router;