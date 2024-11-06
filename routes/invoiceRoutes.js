// routes/invoiceRoutes.js
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

// Get all invoices
router.get('/', (req, res) => {
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
            Orders.OrderDate = Invoices.InvoiceDate
        ORDER BY 
            Invoices.InvoiceID;
    `;
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

export default router;
