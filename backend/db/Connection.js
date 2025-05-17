const { Pool } = require('pg');

// Create a new pool instance
const pool = new Pool({
    host: 'localhost',
    port: process.env.port,
    user: 'postgres',      // Enclose in quotes
    database: 'Vehicle rental system',    // Enclose in quotes and use the correct case
    password: 'Bigyan',    // Enclose in quotes
});

// Test the connection
pool.connect((err, client, done) => {
    if (err) {
        console.log('Connection error', err.stack);
    } else {
        console.log('Connected');
    }
});

// Export the pool
module.exports = pool;