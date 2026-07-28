import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './config/db.js'; 
import userRoutes from './routes/userRoutes.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Essential Global Middlewares
app.use(cors());
app.use(express.json()); 
app.use('/api/users', userRoutes);

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

// Start listening for network traffic
app.listen(PORT, () => {
  console.log(`🚀 Server executing seamlessly on port ${PORT}`);
});
