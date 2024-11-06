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
    db.query('SELECT TotalRevenue, TodayRevenue FROM RevenueData', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length > 0) {
            const { TotalRevenue, TodayRevenue } = results[0];
            res.json({ TotalRevenue, TodayRevenue });
        } else {
            res.status(404).json({ error: "No revenue data found" });
        }
    });
});

export default router;
