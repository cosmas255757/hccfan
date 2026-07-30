import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './config/db.js'; 
import userRoutes from './routes/userRoutes.js'; 
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Essential Global Middlewares
app.use(cors());
app.use(express.json()); 
app.use('/api/users', userRoutes);
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Simple Health Check Endpoint
app.get('/health', async (req, res) => {
  try {
    const dbCheck = await query('SELECT NOW()');
    res.status(200).json({
      status: 'Server is running',
      database: 'Connected',
      timestamp: dbCheck.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ status: 'Server error', database: err.message });
  }
});

// Catch-all route using parameters for modern path-to-regexp engine
app.get('/*any', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start listening for network traffic
app.listen(PORT, () => {
  console.log(`🚀 Server executing seamlessly on port ${PORT}`);
});
