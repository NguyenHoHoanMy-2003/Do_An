import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FormContracts from './FormContracts'; // Import FormContracts
import '../styles/FormContracts.scss'; // Reuse some styles from FormContracts
import { useSelector } from "react-redux"; // Import useSelector

function SignContractPage() {
  const { id: contractId } = useParams(); // Get the contract ID from the URL
  const navigate = useNavigate();
  const [contractDetails, setContractDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.user.token); // Lấy token từ Redux state

  useEffect(() => {
    console.log("SignContractPage - contractId from URL:", contractId);
    const fetchContractDetails = async () => {
      if (!token) return; // Đảm bảo có token trước khi gọi API
      try {
        const response = await fetch(`http://localhost:5001/contracts/sign-contract/${contractId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Không thể tải hợp đồng.');
        }
        const data = await response.json();
        console.log("SignContractPage - Fetched contract data:", data.contract);
        setContractDetails(data.contract); // Assuming backend returns { contract: {...} }

      } catch (err) {
        console.error("Lỗi khi tải thông tin hợp đồng để ký:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (contractId) {
      fetchContractDetails();
    } else {
      setError("Không tìm thấy ID hợp đồng.");
      setLoading(false);
    }
  }, [contractId, token]); // Thêm token vào dependency array

  // Removed handleFileChange and handleSubmitSignature

  if (loading) {
    return <div style={{textAlign: 'center', marginTop: '50px'}}>Đang tải hợp đồng...</div>;
  }

  if (error) {
    return <div style={{textAlign: 'center', color: 'red', marginTop: '50px'}}>Lỗi: {error}</div>;
  }

  if (!contractDetails) {
    return <div style={{textAlign: 'center', marginTop: '50px'}}>Không tìm thấy hợp đồng.</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="contract-form">
        <FormContracts contractDataForForm={contractDetails} isSigningFlow={true} />
      </div>
    </div>
  );
}

export default SignContractPage; 