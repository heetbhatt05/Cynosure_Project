import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// --- FIXED CORS SETUP ---
// Explicitly allow the Vite frontend origin
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Route imports
import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoutes);

// Health Check Endpoint
app.get('/', (req, res) => {
  res.send('Cynosure API is active and running.');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));