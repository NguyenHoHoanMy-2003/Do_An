import React, { useState, useEffect, useCallback } from "react";
import "../styles/Contracts.scss";
import Navbar from "../components/Navbar";
import { FaSearch, FaPrint, FaHistory, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ContractListPage = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [newEndDate, setNewEndDate] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [view, setView] = useState("pending");
  const [modalMode, setModalMode] = useState("");
  const token = useSelector((state) => state.user.token);

  // Memoized callback for fetching contracts
  const fetchContracts = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch("http://localhost:5001/contracts", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Dữ liệu hợp đồng nhận được từ API:", data.contracts);
      setContracts(data.contracts || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách hợp đồng:", error);
    }
  }, [token]);

  // Fetch contracts when the component mounts or when fetchContracts changes
  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const filtered = contracts.filter((c) => {
    const tenantName = c.tenant?.name || ""; // Sử dụng optional chaining
    return tenantName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  console.log("Hợp đồng đã lọc để hiển thị:", filtered);

  const openModal = (contract, mode) => {
    setSelectedContract(contract);
    setModalMode(mode);
    if (mode === "approve") {
      setNewEndDate("");
      setNewPrice("");
    } else if (mode === "renew") {
      setNewEndDate(contract.end_date ? new Date(contract.end_date).toISOString().split('T')[0] : "");
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedContract(null);
    setNewEndDate("");
    setNewPrice("");
  };

  const handleRenew = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      const updatedContract = { end_date: newEndDate, status: "approved" };

      const response = await fetch(`http://localhost:5001/contracts/${selectedContract.id_contract}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedContract),
      });

      if (response.ok) {
        setContracts((prev) =>
          prev.map((c) =>
            c.id_contract === selectedContract.id_contract ? { ...c, ...updatedContract } : c
          )
        );
        alert("Gia hạn thành công!");
        await fetchContracts(); // Re-fetch data after successful renew
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
    if (window.confirm(`Bạn có chắc chắn muốn xóa hợp đồng cho Phòng ${contract.subRoom?.room?.name}?`)) {
      if (!token) return;
      try {
        const response = await fetch(`http://localhost:5001/contracts/${contract.id_contract}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setContracts(prev => prev.filter(c => c.id_contract !== contract.id_contract));
          alert('Xóa hợp đồng thành công!');
          await fetchContracts(); // Re-fetch data after successful delete
        } else {
          alert('Lỗi khi xóa hợp đồng.');
        }
      } catch (error) {
        console.error('Error deleting contract:', error);
        alert('Error deleting contract');
      }
    }
  };
  const isEligibleForRenewal = (endDate, status) => {
    if (status === 'disabled') {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day

    const contractEndDate = new Date(endDate);
    contractEndDate.setHours(0, 0, 0, 0); // Normalize contractEndDate to start of day

    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    // Check if the contract end date is in the future (or today) AND within the next 7 days
    return contractEndDate >= today && contractEndDate <= sevenDaysFromNow;
  };
  const handlePrint = (contract) => {
    // TODO: Implement print functionality here
    alert(`In hợp đồng cho phòng ${contract.subRoom?.room?.name}`);
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
                  <th>Building</th>
                  <th>Address</th>
                  <th>State</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered
                  .filter((c) => c.status === "pending" || c.status === "signed")
                  .map((c) => (
                    <tr key={c.id_contract}>
                      <td>{c.SubRoom?.name}</td>
                      <td>{c.tenant?.name}</td>
                      <td>{c.SubRoom?.room?.property?.name_bd}</td>
                      <td>{c.SubRoom?.room?.property?.street_address}</td>
                      <td>
                        <span className={`status ${c.status === "pending" ? "pending" : "signed"}`}>
                          {c.status === "pending" ? "Pending" : "Signed (Waiting for Approval)"}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button 
                          className="btn small" 
                          onClick={() => handleDetailClick(c)}
                        >
                          Approve
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
                  <th>Building</th>
                  <th>Address</th>
                  <th>State</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered
                  .filter((c) => c.status === "approved" || c.status === "disabled")
                  .map((c) => (
                    <tr key={c.id_contract}>
                      <td>{c.SubRoom?.name}</td>
                      <td>{c.tenant?.name}</td>
                      <td>{new Date(c.start_date).toLocaleDateString('en-GB')}</td>
                      <td>{new Date(c.end_date).toLocaleDateString('en-GB')}</td>
                      <td>{c.gia_thue?.toLocaleString('en-GB')} VND</td>
                      <td>{c.SubRoom?.room?.property?.name_bd}</td>
                      <td>{c.SubRoom?.room?.property?.street_address}</td>
                      <td>
                        <span className={`status ${c.status === "disabled" ? "disabled" : "confirmed"}`}>
                          {c.status === "disabled" ? "Disabled" : "Confirmed"}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          onClick={() => handleDetailClick(c)}
                          className="btn small"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openModal(c, "renew")}
                          className="btn small"
                          disabled={!isEligibleForRenewal(c.end_date, c.status)}
                        >
                          Renew
                        </button>
                        <button className="btn small print" onClick={() => handlePrint(c)}>
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

        {showModal && modalMode === "renew" && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Gia hạn hợp đồng</h3>
              <p className="tenant-name">Người thuê: {selectedContract.tenant?.name}</p>
              <form onSubmit={handleRenew}>
                <div className="form-group">
                  <label>Ngày kết thúc mới:</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn">Lưu</button>
                  <button type="button" onClick={closeModal} className="btn cancel">
                    Hủy
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