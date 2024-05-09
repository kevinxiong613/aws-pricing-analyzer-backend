require("dotenv").config();

const Pool = require("pg").Pool; // Connect to pg database and use Pool to configure

console.log("Initializing database connection pool...");
const pool = new Pool({
    // Postgres database connection
    user: process.env.PG_USER,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

module.exports = pool; // Export the pool object to be used, "module" is a self-contained piece of code that can export functionality to other modules.

console.log("Database connection pool initialized");
