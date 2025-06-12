import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ApproveContractButton({ contractId, onApprove }) {
  const navigate = useNavigate();
  const token = useSelector(state => state.user?.token) || localStorage.getItem('token');

  const handleApprove = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn phê duyệt hợp đồng này?')) {
      return;
    }

    if (!token) {
      alert('Vui lòng đăng nhập lại để thực hiện thao tác này');
      navigate('/login');
      return;
    }

    try {
      console.log('Token being sent:', token); // Debug log

      const response = await fetch(`http://localhost:5001/contracts/${contractId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        alert('Hợp đồng đã được phê duyệt thành công!');
        if (onApprove) {
          onApprove();
        }
        navigate('/my-contracts');
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData); // Debug log
        alert(`Lỗi khi phê duyệt hợp đồng: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Lỗi khi phê duyệt hợp đồng:', error);
      alert('Đã xảy ra lỗi khi phê duyệt hợp đồng.');
    }
  };

  return (
    <button 
      onClick={handleApprove}
      className="approve-button"
      style={{
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '20px'
      }}
    >
      Phê duyệt hợp đồng
    </button>
  );
}

export default ApproveContractButton; 