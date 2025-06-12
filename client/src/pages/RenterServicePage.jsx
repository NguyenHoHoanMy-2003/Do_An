import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import "../styles/RenterServicePage.scss";

const RenterServicePage = () => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Mock API call for services. In a real application, you would fetch from your backend.
        // Example: const response = await fetch('http://localhost:5001/api/services');
        // const data = await response.json();
        const mockServices = [
          { id: 1, name: 'Electricity Bill', unit: 'kWh', pricePerUnit: 3000 },
          { id: 2, name: 'Water Bill', unit: 'm³', pricePerUnit: 10000 },
          { id: 3, name: 'Internet Bill', unit: 'month', pricePerUnit: 100000 },
          { id: 4, name: 'Service Fee', unit: 'month', pricePerUnit: 50000 },
        ];
        setServices(mockServices);

        // Simulate fetching user's currently selected services
        // In a real app, this would be another API call: /users/:userId/services
        const mockUserSelectedServices = { 1: true, 3: true }; // Example: User selected Electricity and Internet
        setSelectedServices(mockUserSelectedServices);

      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const handleSaveChanges = async () => {
    setSaveMessage("");
    try {
      // In a real application, you would send selectedServices to your backend
      // Example: const response = await fetch('http://localhost:5001/api/users/:userId/services', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ selectedServices }),
      // });
      // if (!response.ok) throw new Error('Failed to save changes');

      console.log("Saving selected services:", selectedServices);
      setSaveMessage("Changes saved successfully!");
      // Optionally, refetch services or update UI to reflect saved state
    } catch (err) {
      console.error("Error saving changes:", err);
      setSaveMessage("Failed to save changes. Please try again.");
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="renter-service-container">
          <h2>Services & Utilities</h2>
          <p>Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="renter-service-container">
          <h2>Services & Utilities</h2>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="renter-service-container">
        <h2>Services & Utilities</h2>
        {saveMessage && (
          <div className={`save-message ${saveMessage.includes("successfully") ? "success" : "error"}`}>
            {saveMessage}
          </div>
        )}
        <div className="service-list">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <h3 className="service-name">{service.name}</h3>
              <p className="service-detail">Unit: {service.unit}</p>
              <p className="service-detail">Price: {service.pricePerUnit.toLocaleString('en-US')} VND</p>
              <div className="service-selection">
                <label htmlFor={`service-${service.id}`}>
                  <input
                    type="checkbox"
                    id={`service-${service.id}`}
                    checked={!!selectedServices[service.id]}
                    onChange={() => handleServiceToggle(service.id)}
                  />
                  Select Monthly
                </label>
              </div>
            </div>
          ))}
        </div>
        <div className="save-button-container">
          <button className="save-button" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenterServicePage; 