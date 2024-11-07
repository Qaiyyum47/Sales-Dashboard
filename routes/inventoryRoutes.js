// routes/productRoutes.js
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

// Backend: Route to get products with their category names and stock totals
router.get('/', (req, res) => {
    db.query(`
       SELECT 
    p.ProductID, 
    p.ProductName, 
    p.Description, 
    p.Price, 
    p.StockQuantity, 
    SUM(p.StockQuantity) OVER () AS TotalStockQuantity,
    p.VendorID, 
    p.CategoryID, 
    p.ImageURL, 
    DATE_FORMAT(p.DateAdded, '%m-%d-%Y') AS DateAdded, 
    p.SKU, 
    c.CategoryName
FROM 
    Products p
JOIN 
    Categories c ON p.CategoryID = c.CategoryID;

    `, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        // Calculate the total stock per category
        const groupedData = results.reduce((acc, product) => {
            const category = product.CategoryName;
            const stock = product.StockQuantity;

            // If the category exists, add stock to existing total, otherwise create a new category entry
            if (acc[category]) {
                acc[category] += stock;
            } else {
                acc[category] = stock;
            }

            return acc;
        }, {});

        // Convert to an array for frontend use (category and total stock)
        const inventoryData = Object.keys(groupedData).map(category => ({
            category,
            stock: groupedData[category]
        }));

        // Send the products and inventory data in the response
        res.json({
            products: results,
            inventory: inventoryData
        });
    });
});


export default router;