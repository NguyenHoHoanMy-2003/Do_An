import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/PayBillRenter.scss';

const billData = {
  room: 'A101',
  contractCode: '3131',
  roomPrice: 4500000,
  services: [
    { name: 'Wifi', price: 100000 },
    { name: 'Giữ xe', price: 30000 },
    { name: 'Rác', price: 10000 },
  ],
  electricity: { unitPrice: 4000, quantity: 10, total: 40000 },
  water: { unitPrice: 8000, quantity: 5, total: 40000 },
  month: 11,
  total: 5080000,
  qrCodes: [
    { src: '/images/momo_qr.png', alt: 'Momo QR' },
    { src: '/images/vnpay_qr.png', alt: 'VNPay QR' },
    { src: '/images/bank_qr.png', alt: 'Bank QR' },
  ]
};

const PayBillRenter = () => {
  return (
    <div>
      <Navbar />
      <div className="paybill-renter-container">
        <h1>Thông tin thanh toán</h1>
        <div className="bill-header">
          <div>Phòng : <b>{billData.room}</b></div>
          <div>Mã hợp đồng : <b>{billData.contractCode}</b></div>
          <div>Giá phòng : <b>{billData.roomPrice.toLocaleString('vi-VN')}đ</b></div>
        </div>
        <h2>Thông tin chi tiết tháng {billData.month}</h2>
        <div className="bill-content">
          <div className="bill-details">
            <div className="row">
              <span>Giá phòng</span>
              <input value={billData.roomPrice.toLocaleString('vi-VN') + ' đ'} readOnly />
            </div>
            <div className="row">
              <span>Dịch vụ</span>
              <input value={billData.services.reduce((a, b) => a + b.price, 0).toLocaleString('vi-VN') + 'đ'} readOnly />
            </div>
            {billData.services.map((s, i) => (
              <div className="row sub" key={i}>
                <span>{s.name}</span>
                <input value={s.price.toLocaleString('vi-VN') + 'đ'} readOnly />
              </div>
            ))}
            <div className="row">
              <span>Tiền điện</span>
              <input value={billData.electricity.total.toLocaleString('vi-VN') + 'đ'} readOnly />
            </div>
            <div className="row sub">
              <span>Đơn giá</span>
              <input value={billData.electricity.unitPrice.toLocaleString('vi-VN') + 'đ'} readOnly />
              <span>Số lượng</span>
              <input value={billData.electricity.quantity + ' số'} readOnly />
            </div>
            <div className="row">
              <span>Tiền nước</span>
              <input value={billData.water.total.toLocaleString('vi-VN') + 'đ'} readOnly />
            </div>
            <div className="row sub">
              <span>Đơn giá</span>
              <input value={billData.water.unitPrice.toLocaleString('vi-VN') + 'đ'} readOnly />
              <span>Số lượng</span>
              <input value={billData.water.quantity + ' m3'} readOnly />
            </div>
            <div className="row total">
              <span>Tổng</span>
              <input value={billData.total.toLocaleString('vi-VN') + 'đ'} readOnly />
            </div>
          </div>
          <div className="bill-payment">
            <div className="payment-title">Lựa chọn phương thức thanh toán</div>
            <div className="qr-list">
              {billData.qrCodes.map((qr, i) => (
                <img key={i} src={qr.src} alt={qr.alt} className="qr-img" />
              ))}
            </div>
            <div className="payment-note">
              Quý khách vui lòng lưu lại biên lai chuyển khoản<br />
              nếu có các khiếu nại liên quan.
            </div>
            <button className="back-btn">Trở lại</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayBillRenter; 