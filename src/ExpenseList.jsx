import React, { useState, useEffect } from 'react';
import { expenseService } from './api';

export default function ExpenseList({ vehicleId }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicleId) {
      fetchExpenses();
    }
  }, [vehicleId]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await expenseService.getExpenses(vehicleId);
      setExpenses(response.data);
    } catch (err) {
      console.error('Failed to fetch expenses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.deleteExpense(expenseId);
        fetchExpenses();
      } catch (err) {
        console.error('Failed to delete expense', err);
      }
    }
  };

  return (
    <div className="expense-list-container">
      <h2>Expense History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : expenses.length === 0 ? (
        <p>No expenses recorded yet.</p>
      ) : (
        <table className="expense-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Liters</th>
              <th>Cost</th>
              <th>Cost/Liter</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>{expense.liters}</td>
                <td>${expense.cost.toFixed(2)}</td>
                <td>${(expense.cost / expense.liters).toFixed(2)}</td>
                <td>
                  <button onClick={() => handleDelete(expense.id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
