const { Pool } = require("pg");
require("dotenv").config();

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Function to connect DB
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL Connected Successfully");
    // client.release();
  } catch (error) {
    console.error("❌ PostgreSQL Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = {
  pool,
  connectDB,
};
