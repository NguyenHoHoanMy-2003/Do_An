import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/PaymentHistory.scss';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // TODO: Fetch payment history from API
    // For now using dummy data
    setPayments([
      {
        id: 1,
        date: "2024-03-01",
        amount: "2000000",
        type: "rent",
        status: "paid",
        roomAddress: "123 Đường ABC, Quận XYZ"
      },
      {
        id: 2,
        date: "2024-03-05",
        amount: "500000",
        type: "utilities",
        status: "paid",
        roomAddress: "123 Đường ABC, Quận XYZ"
      }
    ]);
    setLoading(false);
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <div className="payment-history">
        <h1>Payment History</h1>
        {loading ? (
          <div>Loading...</div>
        ) : payments.length === 0 ? (
          <div className="no-payments">
            <p>No payment history found.</p>
          </div>
        ) : (
          <div className="payments-list">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Room</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.date}</td>
                    <td>{payment.type}</td>
                    <td>{payment.amount} VND</td>
                    <td>
                      <span className={`status ${payment.status}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td>{payment.roomAddress}</td>
                    <td>
                      <button onClick={() => window.open(`/receipts/${payment.id}`, '_blank')}>
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory; 