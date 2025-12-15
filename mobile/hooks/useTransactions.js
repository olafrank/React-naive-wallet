// react custom hook to manage transactions

import { useState, useCallback } from "react"
import { Alert } from "react-native"


const API_URL = "https://wallet-api-husk.onrender.com/api";

export const useTransactions = (userId) => {

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
            const response = await fetch(`${API_URL}/transactions/${userId}`);
            const data = await response.json();
            setTransactions(data);

        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    }, [userId]);

    const fetchSumary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/summary/${userId}`);
            const data = await response.json();
            setSummary(data);

        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    }, [userId]);

    // useCallback to load both transactions and summary

    const loadData = useCallback(async () => {
        if (!userId) return;

        setisLoading(true);

        try {
            //can be run in parallel

            await Promise.all([fetchTransactions(), fetchSumary()]);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setisLoading(false);
        }
    }, [userId, fetchTransactions, fetchSumary]);


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
