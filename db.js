// db.js
import mysql from 'mysql2/promise'; // Use the promise version of mysql2

// Create a connection pool for better management of connections
const pool = mysql.createPool({
    host: '127.0.0.1', // Use this for local MySQL service
    port: 3306, // Optional, since it's the default port
    user: 'root', // Your MySQL username
    password: 'root', // Your MySQL password
    database: 'ecommercedb', // The name of your database
});

// Function to connect to the database (optional since pool handles connections)
const connectToDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL database');
        connection.release(); // Release the connection back to the pool
    } catch (err) {
        console.error('Error connecting to MySQL:', err);
    }
};

// Call the connect function to test the connection (optional)
connectToDatabase();

export default pool; // Export the pool to use in other files
