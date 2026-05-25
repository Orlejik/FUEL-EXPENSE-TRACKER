import React, { useState, useEffect } from 'react';
import { vehicleService, expenseService } from '../api';
import VehicleList from '../VehicleList';
import ExpenseForm from '../ExpenseForm';
import ExpenseList from '../ExpenseList';
import Analytics from '../Analytics';

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeTab, setActiveTab] = useState('expenses');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await vehicleService.getVehicles();
      setVehicles(response.data);
      if (response.data.length > 0) {
        setSelectedVehicle(response.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch vehicles', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleAdded = () => {
    fetchVehicles();
  };

  const handleVehicleDeleted = () => {
    fetchVehicles();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Fuel Expense Tracker</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'expenses' ? 'active' : ''}
          onClick={() => setActiveTab('expenses')}
        >
          Expenses
        </button>
        <button
          className={activeTab === 'vehicles' ? 'active' : ''}
          onClick={() => setActiveTab('vehicles')}
        >
          Vehicles
        </button>
        <button
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </nav>

      {activeTab === 'expenses' && (
        <div className="expenses-section">
          <ExpenseForm
            selectedVehicle={selectedVehicle}
            vehicles={vehicles}
            onExpenseAdded={() => {}}
          />
          <ExpenseList vehicleId={selectedVehicle} />
        </div>
      )}

      {activeTab === 'vehicles' && (
        <div className="vehicles-section">
          <VehicleList vehicles={vehicles} onVehicleAdded={handleVehicleAdded} onVehicleDeleted={handleVehicleDeleted} />
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="analytics-section">
          <Analytics />
        </div>
      )}
    </div>
  );
}
