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
            p.VendorID, 
            p.CategoryID, 
            p.ImageURL, 
            DATE_FORMAT(p.DateAdded, '%m-%d-%Y') AS DateAdded, 
            p.SKU, 
            c.CategoryName
        FROM Products p
        JOIN Categories c ON p.CategoryID = c.CategoryID
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


// Add a product
router.post('/', (req, res) => {
    const { ProductName, Description, Price, StockQuantity, VendorID, CategoryID, ImageURL, SKU, DateAdded } = req.body;

    // If DateAdded is not provided, set it to null or some other value (optional)
    const validDateAdded = DateAdded || null;

    const query = `
        INSERT INTO Products 
        (ProductName, Description, Price, StockQuantity, VendorID, CategoryID, ImageURL, DateAdded, SKU) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(query, [ProductName, Description, Price, StockQuantity, VendorID, CategoryID, ImageURL, validDateAdded, SKU], (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to add product" });
        res.status(201).json({ message: 'Product added successfully', id: results.insertId });
    });
});

// Update a product
router.put('/:id', (req, res) => {
    const productId = req.params.id;
    const { ProductName, Description, Price, StockQuantity, VendorID, CategoryID, ImageURL, DateAdded, SKU } = req.body;

    // Ensure DateAdded is in the correct format (YYYY-MM-DD)
    let validDateAdded = DateAdded;
    if (DateAdded && isNaN(Date.parse(DateAdded))) {
        return res.status(400).json({ error: 'Invalid Date format' });
    } else if (!DateAdded) {
        // If no DateAdded provided, default to current date
        validDateAdded = new Date().toISOString().slice(0, 10); // Get today's date as YYYY-MM-DD
    }

    const query = `
        UPDATE Products 
        SET ProductName = ?, Description = ?, Price = ?, StockQuantity = ?, VendorID = ?, 
            CategoryID = ?, ImageURL = ?, DateAdded = ?, SKU = ? 
        WHERE ProductID = ?
    `;

    db.query(query, [ProductName, Description, Price, StockQuantity, VendorID, CategoryID, ImageURL, validDateAdded, SKU, productId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product updated successfully' });
    });
});

// Delete product
router.delete('/:id', (req, res) => {
    const productId = req.params.id;
    db.query('DELETE FROM Products WHERE ProductID = ?', [productId], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to delete product" });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found" });
        res.status(204).send();
    });
});


export default router;
