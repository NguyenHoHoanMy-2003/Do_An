import React, { useState, useEffect } from "react";
import "../styles/Contracts.scss";
import Navbar from "../components/Navbar";
import { FaSearch, FaPrint, FaHistory, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ContractListPage = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [newEndDate, setNewEndDate] = useState("");
  const [view, setView] = useState("pending");


  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch("http://localhost:5001/contracts");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setContracts(data.contracts || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách hợp đồng:", error);
      }
    };

    fetchContracts();
  }, []);

  const filtered = contracts.filter((c) =>
    c.tenantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (contract) => {
    setSelectedContract(contract);
    setNewEndDate(contract.endDate);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedContract(null);
    setNewEndDate("");
  };

  const handleRenew = async (e) => {
    e.preventDefault();

    try {
      const updatedContract = { ...selectedContract, endDate: newEndDate };

      const response = await fetch(`http://localhost:5001/contracts/${selectedContract.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContract),
      });

      if (response.ok) {
        setContracts((prev) =>
          prev.map((c) =>
            c.id === selectedContract.id ? updatedContract : c
          )
        );
        alert("Gia hạn thành công!");
      } else {
        alert("Lỗi khi gia hạn hợp đồng.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu gia hạn:", error);
      alert("Đã xảy ra lỗi.");
    }

    closeModal();
  };

  const handleDetailClick = (contract) => {
    navigate('/contract-form', { state: { contractData: contract } });
  };

  const handleDelete = async (contract) => {
    if (window.confirm(`Are you sure you want to delete this contract for Room ${contract.room}?`)) {
      try {
        const response = await fetch(`http://localhost:5001/contracts/${contract.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setContracts(prev => prev.filter(c => c.id !== contract.id));
          alert('Contract deleted successfully!');
        } else {
          alert('Error deleting contract');
        }
      } catch (error) {
        console.error('Error deleting contract:', error);
        alert('Error deleting contract');
      }
    }
  };

  const isContractExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };
  return (
    <div>
      <Navbar />
      <div className="contracts-page">
        <h2>List of Contracts</h2>

        <div className="actions">
          <button 
            onClick={() => setView("pending")} 
            className={`btn ${view === "pending" ? "active" : ""}`}
          >
            <FaHistory /> Pending
          </button>
          <button 
            onClick={() => setView("confirmed")} 
            className={`btn ${view === "confirmed" ? "active" : ""}`}
          >
            <FaHistory /> Confirmed
          </button>
        </div>

        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search Room and Tenant Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {view === "pending" && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Tenant Name</th>
                  <th>State</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered
                  .filter((c) => c.status === "pending")
                  .map((c) => (
                    <tr key={c.id}>
                      <td>{c.room}</td>
                      <td>{c.tenantName}</td>
                      <td>
                        <span className="status pending">Pending</span>
                      </td>
                      <td>
                        <button className="btn small">Detail</button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === "confirmed" && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Tenant Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Price</th>
                  <th>State</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered
                  .filter((c) => c.status === "confirmed" || c.status === "disabled")
                  .map((c) => (
                    <tr key={c.id}>
                      <td>{c.room}</td>
                      <td>{c.tenantName}</td>
                      <td>{new Date(c.startDate).toLocaleDateString('en-GB')}</td>
                      <td>{new Date(c.endDate).toLocaleDateString('en-GB')}</td>
                      <td>{c.price.toLocaleString('en-GB')} VND</td>
                      <td>
                        <span className={`status ${c.status === "disabled" ? "disabled" : "confirmed"}`}>
                          {c.status === "disabled" ? "Disabled" : "Confirmed"}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          onClick={() => openModal(c)}
                          className="btn small"
                          disabled={c.status !== 'disabled' && isContractExpired(c.endDate)}
                        >
                          Renew
                        </button>
                        <button className="btn small print">
                          <FaPrint /> Print
                        </button>
                        <button
                          className="btn small delete"
                          onClick={() => handleDelete(c)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Renew Contract</h3>
              <p className="tenant-name">Tenant: {selectedContract.tenantName}</p>
              <form onSubmit={handleRenew}>
                <div className="form-group">
                  <label>New End Date:</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn">Save</button>
                  <button type="button" onClick={closeModal} className="btn cancel">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractListPage;
