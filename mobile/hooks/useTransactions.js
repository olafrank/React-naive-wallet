// react custom hook to manage transactions

import { useState, useCallback } from "react"
import { Alert } from "react-native"


const API_URL = "http://localhost:5001/api";

export const useTransactions = (user_id) => {

    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0

    }
    )

    const [isLoading, setisLoading] = useState(true);


    // useCallback to fetch transactions by user for better performance and memorization

    const fetchTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/${user_id}`);
            const data = await response.json();
            setTransactions(data);

        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    }, [user_id]);

    const fetchSumary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/summary/${user_id}`);
            const data = await response.json();
            setSummary(data);

        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    }, [user_id]);

    // useCallback to load both transactions and summary

    const loadData = useCallback(async () => {
        if (!user_id) return;

        setisLoading(true);

        try {
            //can be run in parallel

            await Promise.all([fetchTransactions(), fetchSumary()]);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setisLoading(false);
        }
    }, [user_id, fetchTransactions, fetchSumary]);


    const deleteTransaction = async (id) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, { method: 'DELETE' });
            if (response.ok) throw new Error('Failed to delete transaction');

            // Refresh data after deletion
            loadData();

        } catch (error) {
            console.error("Error deleting transaction:", error);
            Alert.alert("Error", error.message);
        }
    }

    return { transactions, summary, isLoading, loadData, deleteTransaction };
}
