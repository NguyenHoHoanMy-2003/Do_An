import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormContracts from "./FormContracts";
import "../styles/MyContracts.scss";

const MyContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContracts = async () => {
      if (!user || !user.id_user || !token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:5001/contracts/renter/${user.id_user}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          const approvedContracts = data.contracts.filter(
            (c) => c.status === "approved"
          );
          setContracts(
            approvedContracts.length > 0 ? [approvedContracts[0]] : []
          );
          console.log(
            "MyContracts - Contract data in state (for FormContracts):"
          );
          if (approvedContracts.length > 0) {
            console.log(approvedContracts[0]);
          } else {
            console.log("No approved contracts found.");
          }
        } else {
          setError(data.message || "Failed to fetch contracts.");
          setContracts([]);
        }
      } catch (err) {
        console.error("Error fetching contracts:", err);
        setError("Error connecting to the server.");
        setContracts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [user, navigate, token]);

  const handleViewContract = (contract) => {
    console.log("View contract with ID:", contract.id_contract);
    navigate("/contract-form", { state: { contractData: contract } });
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30.44);
    return `${diffMonths} tháng`;
  };

  return (
    <div>
      <div className="my-contracts">
        <h1>My Contracts</h1>
        {loading ? (
          <div>Loading contracts...</div>
        ) : error ? (
          <div className="error-message">Error: {error}</div>
        ) : contracts.length === 0 ? (
          <div className="no-contracts">
            <p>You don't have any contracts yet.</p>
          </div>
        ) : (
          <FormContracts
            contractDataForForm={contracts[0]}
            isSigningFlow={false}
            isReadOnlyView={true}
          />
        )}
      </div>
    </div>
  );
};

export default MyContracts;
