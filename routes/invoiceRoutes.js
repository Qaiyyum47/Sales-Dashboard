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

// Get invoice for a specific order by OrderID
router.get('/:orderId', (req, res) => {
  const { orderId } = req.params;

  const query = `
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
        Orders o ON c.CustomerID = o.CustomerID
    WHERE 
        o.OrderID = ?;
  `;

  // Execute the query, passing the orderId to filter the result
  db.query(query, [orderId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ message: 'Invoice not found for this Order ID.' });
    }
    res.json(results[0]); // Assuming only one invoice per order
  });
});

export default router;
