import React, { useState } from 'react';
import { expenseService } from './api';

export default function ExpenseForm({ selectedVehicle, vehicles, onExpenseAdded }) {
  const [formData, setFormData] = useState({
    vehicle_id: selectedVehicle,
    liters: '',
    cost: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await expenseService.createExpense({
        ...formData,
        vehicle_id: parseInt(formData.vehicle_id),
        liters: parseFloat(formData.liters),
        cost: parseFloat(formData.cost),
        date: new Date(formData.date).toISOString(),
      });
      setFormData({
        vehicle_id: selectedVehicle,
        liters: '',
        cost: '',
        date: new Date().toISOString().split('T')[0],
      });
      onExpenseAdded();
    } catch (err) {
      console.error('Failed to create expense', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-form-container">
      <h2>Log Fuel Expense</h2>
      <form onSubmit={handleSubmit} className="expense-form">
        <select
          value={formData.vehicle_id}
          onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
          required
        >
          <option value="">Select Vehicle</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Liters"
          step="0.01"
          value={formData.liters}
          onChange={(e) => setFormData({ ...formData, liters: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Cost"
          step="0.01"
          value={formData.cost}
          onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
          required
        />
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging...' : 'Log Expense'}
        </button>
      </form>
    </div>
  );
}
