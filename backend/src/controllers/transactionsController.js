
import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {

    try {
        const { user_id } = req.params;

        const transactions = await sql`
            SELECT * FROM transactions WHERE user_id = ${user_id} ORDER BY created_at DESC`;
        res.status(200).json(transactions);

    } catch (error) {
        console.error("Error getting transaction:", error.message, error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};

export async function createTransaction(req, res) {
    // title, amount, category, user_id
    try {
        const { title, amount, category, user_id } = req.body;

        if (!title || !amount || !category || !user_id) {
            return res.status(400).json({ error: "Missing required fields" });

        }
        const transaction = await sql`INSERT INTO transactions (title, amount, category, user_id) VALUES (${title}, ${amount}, ${category}, ${user_id}) RETURNING *`;
        res.status(201).json(transaction[0]);
        console.log("Transaction added:", transaction[0]);


    } catch (error) {
        console.error("Error adding transaction:", error.message, error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
}

export async function deleteTransaction(req, res) {

    try {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ error: "Invalid transaction ID" });
        }

        const result = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;

        if (result.length === 0) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction deleted successfully", transaction: result[0] });

    } catch (error) {
        console.error("Error deleting transaction:", error.message, error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
}


export async function getTransactionSummaryByUserId(req, res) {
    try {
        const { user_id } = req.params;

        const balanceResult = await sql`
        SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${user_id};`

        const incomeResult = await sql`
        SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${user_id} AND amount > 0;`

        const expenseResult = await sql`
        SELECT COALESCE(SUM(amount),0) as expenses FROM transactions WHERE user_id = ${user_id} AND amount < 0;`

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expenseResult[0].expenses
        });

    } catch (error) {
        console.error("Error getting summary:", error.message, error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
}
