import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './db.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(3000, () => {
  console.log('Zenio backend running on port 3000');
});