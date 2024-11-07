// routes/revenueRoutes.js
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

router.get('/', (req, res) => {
    console.log("Revenue route hit1");
    db.query(`SELECT 
    Date, 
    MonthRevenue, 
    ItemSold,
    SUM(MonthRevenue) OVER () AS TotalRevenue,
    SUM(ItemSold) OVER () AS ItemSold,
    ROUND((MonthRevenue * 100.0 / SUM(MonthRevenue) OVER ()), 1) AS RevenuePercentage
    FROM RevenueData;`, 
    (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length > 0) {
            res.json(results); // All rows include TotalRevenue
        } else {
            res.status(404).json({ error: "No revenue data found" });
        }
    });
});




export default router;
