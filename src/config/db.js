import pkg from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const { Pool } = pkg;

// Initialize connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
});

// Verify connection on startup
pool.query('SELECT NOW()')
  .then(() => console.log('Neon PostgreSQL connected successfully!'))
  .catch((err) => console.error('Database connection failed:', err.message));

// Export query helper using ES Modules export syntax
export const query = (text, params) => pool.query(text, params);
