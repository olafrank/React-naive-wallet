import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoutes from './routes/transactionsRoutes.js';
import { initDB } from './config/db.js';
import job from './config/cron.js';




dotenv.config();

// Start the cron job when app in production
if (process.env.NODE_ENV === 'production') {
    job.start();
}


// Verify DATABASE_URL exists
if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL environment variable is not set");
    process.exit(1);
}

const PORT = process.env.PORT || 5001;

const app = express();

//middleware - order matters
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use('/api/transactions', transactionsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Error handler for unmatched routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

initDB().then(() => {
    app.listen(PORT, () => { console.log("Server is running on PORT", PORT) });
}).catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
});