import React, { useState, useEffect } from "react";
import "../styles/Contracts.scss";
import Navbar from "../components/Navbar";
import { FaSearch, FaPrint, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ContractListPage = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([
    // Pending contracts
    {
      id: 1,
      room: "101",
      tenantName: "Nguyễn Văn A",
      status: "pending",
      startDate: "2024-03-01",
      endDate: "2024-09-01",
      price: 3000000
    },
    {
      id: 2,
      room: "102",
      tenantName: "Trần Thị B",
      status: "pending",
      startDate: "2024-03-15",
      endDate: "2024-09-15",
      price: 3500000
    },
    // Confirmed contracts
    {
      id: 3,
      room: "201",
      tenantName: "Lê Văn C",
      status: "confirmed",
      startDate: "2024-01-01",
      endDate: "2024-07-01",
      price: 4000000
    },
    {
      id: 4,
      room: "202",
      tenantName: "Phạm Thị D",
      status: "confirmed",
      startDate: "2024-02-01",
      endDate: "2024-08-01",
      price: 3800000
    },
    {
      id: 5,
      room: "301",
      tenantName: "Hoàng Văn E",
      status: "confirmed",
      startDate: "2024-01-15",
      endDate: "2024-07-15",
      price: 4200000
    }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [newEndDate, setNewEndDate] = useState("");
  const [view, setView] = useState("confirmed");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch("http://localhost:5001/contracts");
        const data = await response.json();
        setContracts(data);
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
                        <button 
                          className="btn small" 
                          onClick={() => handleDetailClick(c)}
                        >
                          Detail
                        </button>
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
                  .filter((c) => c.status === "confirmed")
                  .map((c) => (
                    <tr key={c.id}>
                      <td>{c.room}</td>
                      <td>{c.tenantName}</td>
                      <td>{new Date(c.startDate).toLocaleDateString('en-GB')}</td>
                      <td>{new Date(c.endDate).toLocaleDateString('en-GB')}</td>
                      <td>{c.price.toLocaleString('en-GB')} VND</td>
                      <td>
                        <span className="status confirmed">Confirmed</span>
                      </td>
                      <td className="actions-cell">
                        <button onClick={() => openModal(c)} className="btn small">
                          Renew
                        </button>
                        <button className="btn small print">
                          <FaPrint /> Print
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
