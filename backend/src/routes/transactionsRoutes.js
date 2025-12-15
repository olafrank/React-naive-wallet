import express from 'express';
import {
    getTransactionsByUserId,
    getTransactionSummaryByUserId,
    createTransaction,
    deleteTransaction,
} from '../controllers/transactionsController.js';


const router = express.Router();

// Define your transaction routes here
// Order matters: specific routes must come before generic :param routes

router.get("/summary/:user_id", getTransactionSummaryByUserId);

router.get("/:user_id", getTransactionsByUserId);

router.post("/", createTransaction);

router.delete("/:id", deleteTransaction);

export default router