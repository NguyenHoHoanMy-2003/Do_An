// paybil.jsx
import React, { useState } from 'react';
import '../styles/PayBill.scss';
import Navbar from "../components/Navbar";

const PayBill = () => {
  const [activeTab, setActiveTab] = useState('payment');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showInputModal, setShowInputModal] = useState(false);
  const [readings, setReadings] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [monthlyReadingsData, setMonthlyReadingsData] = useState({}); // { 'YYYY-MM': { 'roomCode': { water: 'val', electricity: 'val' } } }
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedFloor, setSelectedFloor] = useState('all');

  const paymentData = [
    { 
      code: 'CT001', 
      room: 'A-101', 
      tenant: 'Nguyen Van A', 
      price: 2000000,
      propertyId: 'A',
      floorId: '1',
      services: [
        { name: 'Electricity', price: 500000 },
        { name: 'Water', price: 200000 },
        { name: 'Internet', price: 300000 }
      ],
      state: 'Paid' 
    },
    { 
      code: 'CT002', 
      room: 'A-102', 
      tenant: 'Tran Thi B', 
      price: 1800000,
      propertyId: 'A',
      floorId: '1',
      services: [
        { name: 'Electricity', price: 450000 },
        { name: 'Water', price: 150000 },
        { name: 'Internet', price: 300000 }
      ],
      state: 'Unpaid' 
    },
    { 
        code: 'CT003', 
        room: 'B-201', 
        tenant: 'Le Van C', 
        price: 2200000,
        propertyId: 'B',
        floorId: '2',
        services: [
          { name: 'Electricity', price: 600000 },
          { name: 'Water', price: 250000 },
          { name: 'Internet', price: 300000 }
        ],
        state: 'Paid' 
    },
    { 
        code: 'CT004', 
        room: 'B-202', 
        tenant: 'Pham Van D', 
        price: 2100000,
        propertyId: 'B',
        floorId: '2',
        services: [
          { name: 'Electricity', price: 550000 },
          { name: 'Water', price: 200000 },
          { name: 'Internet', price: 300000 }
        ],
        state: 'Unpaid' 
    },
  ];

  const staticProperties = [
    { id: 'all', name: 'Tất cả Dãy' },
    { id: 'A', name: 'Dãy A' },
    { id: 'B', name: 'Dãy B' },
  ];

  const staticFloors = [
    { id: 'all', name: 'Tất cả Tầng', propertyId: 'all' },
    { id: '1', name: 'Tầng 1', propertyId: 'A' },
    { id: '2', name: 'Tầng 2', propertyId: 'B' },
    { id: '3', name: 'Tầng 3', propertyId: 'B' },
  ];

  const filteredFloors = staticFloors.filter(floor => 
    selectedProperty === 'all' || floor.propertyId === selectedProperty || floor.propertyId === 'all'
  );


  const [services, setServices] = useState([
    { id: 1, service: 'Electricity', price: '500000' },
    { id: 2, service: 'Water', price: '200000' },
  ]);

  const [editService, setEditService] = useState(null);
  const [newService, setNewService] = useState({ service: '', price: '' });

  const handleDelete = (id) => {
    setServices(services.filter((item) => item.id !== id));
  };

  const handleEdit = (item) => {
    setEditService(item);
  };

  const handleUpdate = () => {
    setServices(services.map(s => s.id === editService.id ? editService : s));
    setEditService(null);
  };

  const handleAdd = () => {
    if (!newService.service || !newService.price) return;
    const nextId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
    setServices([...services, { id: nextId, ...newService }]);
    setNewService({ service: '', price: '' });
  };

  const filteredPayments = paymentData.filter(payment => {
    if (paymentFilter === 'all') return true;
    return payment.state.toLowerCase() === paymentFilter.toLowerCase();
  });

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPayment(null);
  };

  const openInputModal = () => {
    // Load existing readings for the selected month, or initialize empty
    const currentMonthReadings = monthlyReadingsData[selectedMonth] || {};
    const initialReadings = {};
    paymentData.forEach(payment => {
      initialReadings[payment.room] = {
        water: currentMonthReadings[payment.room]?.water || '',
        electricity: currentMonthReadings[payment.room]?.electricity || ''
      };
    });
    setReadings(initialReadings);
    setShowInputModal(true);
  };

  const closeInputModal = () => {
    setShowInputModal(false);
    setReadings({});
    setSelectedProperty('all'); // Reset filters when closing
    setSelectedFloor('all');
  };

  const handleReadingChange = (room, type, value) => {
    setReadings(prev => ({
      ...prev,
      [room]: {
        ...prev[room],
        [type]: value
      }
    }));
  };

  const handleUpdateReadings = () => {
    // Save current readings for the selected month
    setMonthlyReadingsData(prev => ({
      ...prev,
      [selectedMonth]: readings
    }));

    console.log(`Updating readings for ${selectedMonth}:`, readings);
    alert("Chức năng cập nhật đang được phát triển!");
    closeInputModal();
  };

  const calculateTotal = (payment) => {
    const servicesTotal = payment.services.reduce((sum, service) => sum + service.price, 0);
    return payment.price + servicesTotal;
  };

  const handlePropertyChange = (e) => {
    setSelectedProperty(e.target.value);
    setSelectedFloor('all'); // Reset floor when property changes
  };

  const handleFloorChange = (e) => {
    setSelectedFloor(e.target.value);
  };

  const filteredRoomsForInput = paymentData.filter(payment => {
    const matchesProperty = selectedProperty === 'all' || payment.propertyId === selectedProperty;
    const matchesFloor = selectedFloor === 'all' || payment.floorId === selectedFloor;
    return matchesProperty && matchesFloor;
  });

  return (
    <div>
      <Navbar />
      <div className={`paybil-container ${showModal || showInputModal ? 'modal-open' : ''}`}>
        <div className="button-group">
          <button 
            className={activeTab === 'payment' ? 'active' : ''}
            onClick={() => setActiveTab('payment')}
          >
            Payment List
          </button>
          <button 
            className={activeTab === 'service' ? 'active' : ''}
            onClick={() => setActiveTab('service')}
          >
            Service
          </button>
          <button
            className="enter-data-btn"
            onClick={openInputModal}
          >
            Enter Data
          </button>
        </div>

        {activeTab === 'payment' && (
          <>
            <div className="filter-section">
              <select 
                value={paymentFilter} 
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Contract Code</th>
                  <th>Room</th>
                  <th>Tenant Name</th>
                  <th>Price</th>
                  <th>State</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((item, index) => (
                  <tr key={index}>
                    <td>{item.code}</td>
                    <td>{item.room}</td>
                    <td>{item.tenant}</td>
                    <td>{item.price.toLocaleString('vi-VN')} VND</td>
                    <td>
                      <span className={`status ${item.state.toLowerCase()}`}>
                        {item.state}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleViewPayment(item)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'service' && (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Serial Number</th>
                  <th>Service</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {services.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      {editService?.id === item.id ? (
                        <input
                          value={editService.service}
                          onChange={(e) =>
                            setEditService({ ...editService, service: e.target.value })
                          }
                        />
                      ) : (
                        item.service
                      )}
                    </td>
                    <td>
                      {editService?.id === item.id ? (
                        <input
                          value={editService.price}
                          onChange={(e) =>
                            setEditService({ ...editService, price: e.target.value })
                          }
                        />
                      ) : (
                        `${parseInt(item.price).toLocaleString('vi-VN')} VND`
                      )}
                    </td>
                    <td>
                      {editService?.id === item.id ? (
                        <button onClick={handleUpdate}>Save</button>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(item)}>Edit</button>
                          <button onClick={() => handleDelete(item.id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="add-form">
              <input
                type="text"
                placeholder="New Service"
                value={newService.service}
                onChange={(e) => setNewService({ ...newService, service: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
              />
              <button onClick={handleAdd}>Add</button>
            </div>
          </>
        )}

        {showModal && selectedPayment && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Payment Details</h3>
              <div className="payment-details">
                <div className="detail-row">
                  <span>Contract Code:</span>
                  <span>{selectedPayment.code}</span>
                </div>
                <div className="detail-row">
                  <span>Room:</span>
                  <span>{selectedPayment.room}</span>
                </div>
                <div className="detail-row">
                  <span>Tenant:</span>
                  <span>{selectedPayment.tenant}</span>
                </div>
                <div className="detail-row">
                  <span>Room Price:</span>
                  <span>{selectedPayment.price.toLocaleString('vi-VN')} VND</span>
                </div>
                <div className="services-section">
                  <h4>Services</h4>
                  {selectedPayment.services.map((service, index) => (
                    <div key={index} className="service-item">
                      <span>{service.name}</span>
                      <span>{service.price.toLocaleString('vi-VN')} VND</span>
                    </div>
                  ))}
                </div>
                <div className="total-section">
                  <span>Total Amount:</span>
                  <span>{calculateTotal(selectedPayment).toLocaleString('vi-VN')} VND</span>
                </div>
              </div>
              <div className="modal-actions">
                <button onClick={closeModal} className="btn">Close</button>
              </div>
            </div>
          </div>
        )}

        {showInputModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Nhập chỉ số điện nước</h3>
              <div className="input-filters">
                <select 
                  value={selectedProperty} 
                  onChange={handlePropertyChange}
                  className="filter-select"
                >
                  {staticProperties.map(prop => (
                    <option key={prop.id} value={prop.id}>{prop.name}</option>
                  ))}
                </select>
                <select 
                  value={selectedFloor} 
                  onChange={handleFloorChange}
                  className="filter-select"
                >
                  {filteredFloors.map(floor => (
                    <option key={floor.id} value={floor.id}>{floor.name}</option>
                  ))}
                </select>
                <input 
                  type="month" 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="filter-select month-select"
                />
              </div>
              <table className="input-readings-table">
                <thead>
                  <tr>
                    <th>Phòng</th>
                    <th>Nước(số)</th>
                    <th>Điện(số)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoomsForInput.map(payment => (
                    <tr key={payment.room}>
                      <td>{payment.room}</td>
                      <td>
                        <input
                          type="number"
                          value={readings[payment.room]?.water || ''}
                          onChange={(e) => handleReadingChange(payment.room, 'water', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={readings[payment.room]?.electricity || ''}
                          onChange={(e) => handleReadingChange(payment.room, 'electricity', e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="modal-actions">
                <button onClick={handleUpdateReadings} className="btn primary">Cập nhật</button>
                <button onClick={closeInputModal} className="btn">Hủy</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayBill;
