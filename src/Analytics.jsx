import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { expenseService } from './api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Analytics() {
  const [stats, setStats] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [statsRes, totalRes] = await Promise.all([
        expenseService.getVehicleStats(),
        expenseService.getTotalSpent(),
      ]);
      setStats(statsRes.data);
      setTotalSpent(totalRes.data.total_spent);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading analytics...</p>;

  return (
    <div className="analytics-container">
      <div className="total-spent-card">
        <h2>Total Spent on Fuel</h2>
        <p className="total-amount">${totalSpent.toFixed(2)}</p>
      </div>

      <div className="stats-grid">
        <div className="bar-chart">
          <h3>Spending by Vehicle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vehicle_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_spent" fill="#8884d8" name="Total Spent ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="pie-chart">
          <h3>Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stats} dataKey="total_spent" nameKey="vehicle_name" cx="50%" cy="50%" outerRadius={80} label>
                {stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="stats-table">
        <h3>Vehicle Statistics</h3>
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Total Spent</th>
              <th>Total Liters</th>
              <th>Avg Cost/Liter</th>
              <th>Expenses</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => (
              <tr key={stat.vehicle_id}>
                <td>{stat.vehicle_name}</td>
                <td>${stat.total_spent.toFixed(2)}</td>
                <td>{stat.total_liters.toFixed(2)}</td>
                <td>${stat.average_cost_per_liter.toFixed(2)}</td>
                <td>{stat.expense_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
