import express from 'express';
import { getTransactionsByUserId } from '../controllers/transactionsController.js';
import { createTransaction } from '../controllers/transactionsController.js';
import { deleteTransaction } from '../controllers/transactionsController.js';
import { getTransactionSummaryByUserId } from '../controllers/transactionsController.js';





const router = express.Router();

// Define your transaction routes here
router.get("/:user_id", getTransactionsByUserId);

router.post("/", createTransaction);

router.delete("/:id", deleteTransaction);


router.get("/summary/:user_id", getTransactionSummaryByUserId)

export default router