import React, { useState, useEffect } from 'react';
import { vehicleService } from './api';

export default function VehicleList({ vehicles, onVehicleAdded, onVehicleDeleted }) {
  const [formData, setFormData] = useState({ name: '', model: '', license_plate: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await vehicleService.createVehicle(formData);
      setFormData({ name: '', model: '', license_plate: '' });
      onVehicleAdded();
    } catch (err) {
      console.error('Failed to create vehicle', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehicleService.deleteVehicle(vehicleId);
        onVehicleDeleted();
      } catch (err) {
        console.error('Failed to delete vehicle', err);
      }
    }
  };

  return (
    <div className="vehicle-section">
      <h2>Add Vehicle</h2>
      <form onSubmit={handleSubmit} className="vehicle-form">
        <input
          type="text"
          placeholder="Vehicle Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Model"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="License Plate"
          value={formData.license_plate}
          onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Vehicle'}
        </button>
      </form>

      <h2>Your Vehicles</h2>
      <div className="vehicle-list">
        {vehicles.length === 0 ? (
          <p>No vehicles added yet.</p>
        ) : (
          vehicles.map((vehicle) => (
            <div key={vehicle.id} className="vehicle-card">
              <h3>{vehicle.name}</h3>
              <p>Model: {vehicle.model}</p>
              <p>License Plate: {vehicle.license_plate}</p>
              <button onClick={() => handleDelete(vehicle.id)} className="delete-btn">
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
