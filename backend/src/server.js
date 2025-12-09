import express from 'express';
import dotenv from 'dotenv';
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoutes from './routes/transactionsRoutes.js';
import { initDB } from './config/db.js';


dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

//middleware
app.use(rateLimiter);
app.use(express.json());
app.use('/api/transactions', transactionsRoutes);




initDB().then(() => {
    app.listen(PORT, () => { console.log("Server is running on PORT", PORT) }
    );
});