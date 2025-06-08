import React, { useState, useEffect } from 'react';
import "../styles/FormContracts.scss";
import Navbar from "../components/Navbar";
import { useLocation } from 'react-router-dom';

function FormContracts() {
  const location = useLocation();
  const contractData = location.state?.contractData;

  const [formData, setFormData] = useState({
    nameA: "",
    yearA: "",
    cccdA: "",
    issueDateA: "",
    placeIssueA: "",
    addressA: "",
    phoneA: "",
    nameB: "",
    yearB: "",
    cccdB: "",
    issueDateB: "",
    placeIssueB: "",
    addressB: "",
    phoneB: "",
    roomAddress: contractData?.room || "",
    duration: "",
    rentStartDate: contractData?.startDate || "",
    price: contractData?.price || "",
    priceText: "",
    payDate: "",
    deposit: "",
    depositText: "",
    contractDate: "",
    signatureA: null,
    signatureB: null
  });

  const [agreeA, setAgreeA] = useState(false);
  const [agreeB, setAgreeB] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, signatureType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [signatureType]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeA || !agreeB) {
      alert("Vui lòng xác nhận đồng ý điều khoản cho cả hai bên!");
      return;
    }
    alert("Hợp đồng đã được gửi!");
    console.log("Dữ liệu hợp đồng:", formData);
  };

  return (
    <div>
      <Navbar />
      <div className="contract-form">
        <h2>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
        <h3>Độc Lập - Tự Do - Hạnh Phúc</h3>
        <div className="divider">---oOo---</div>
        <h2>HỢP ĐỒNG CHO THUÊ PHÒNG TRỌ</h2>

        <form onSubmit={handleSubmit}>
          <div className="section">
            <h3>BÊN A: BÊN CHO THUÊ PHÒNG TRỌ</h3>
            <div className="form-group">
              <label>Họ và Tên:</label>
              <input type="text" name="nameA" value={formData.nameA} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Năm sinh:</label>
              <input type="text" name="yearA" value={formData.yearA} onChange={handleChange} required />
            </div>
            <div className="form-group row">
              <div className="col">
                <label>CCCD số:</label>
                <input type="text" name="cccdA" value={formData.cccdA} onChange={handleChange} required />
              </div>
              <div className="col">
                <label>Ngày cấp:</label>
                <input type="date" name="issueDateA" value={formData.issueDateA} onChange={handleChange} required />
              </div>
              <div className="col">
                <label>Nơi cấp:</label>
                <input type="text" name="placeIssueA" value={formData.placeIssueA} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Thường Trú:</label>
              <input type="text" name="addressA" value={formData.addressA} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Số điện thoại:</label>
              <input type="text" name="phoneA" value={formData.phoneA} onChange={handleChange} required />
            </div>
          </div>

          <div className="section">
            <h3>BÊN B: BÊN THUÊ PHÒNG TRỌ</h3>
            <div className="form-group">
              <label>Họ và Tên:</label>
              <input type="text" name="nameB" value={formData.nameB} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Năm sinh:</label>
              <input type="text" name="yearB" value={formData.yearB} onChange={handleChange} required />
            </div>
            <div className="form-group row">
              <div className="col">
                <label>CCCD số:</label>
                <input type="text" name="cccdB" value={formData.cccdB} onChange={handleChange} required />
              </div>
              <div className="col">
                <label>Ngày cấp:</label>
                <input type="date" name="issueDateB" value={formData.issueDateB} onChange={handleChange} required />
              </div>
              <div className="col">
                <label>Nơi cấp:</label>
                <input type="text" name="placeIssueB" value={formData.placeIssueB} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Thường Trú:</label>
              <input type="text" name="addressB" value={formData.addressB} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Số điện thoại:</label>
              <input type="text" name="phoneB" value={formData.phoneB} onChange={handleChange} required />
            </div>
          </div>

          <div className="section">
            <h3>Hai bên cùng thỏa thuận và đồng ý với nội dung sau:</h3>
            
            <div className="clause">
              <h4>Điều 1:</h4>
              <div className="form-group">
                <label>Địa chỉ phòng trọ:</label>
                <input type="text" name="roomAddress" value={formData.roomAddress} onChange={handleChange} required />
              </div>
              <div className="form-group row">
                <div className="col">
                  <label>Thời hạn thuê (tháng):</label>
                  <input type="text" name="duration" value={formData.duration} onChange={handleChange} required />
                </div>
                <div className="col">
                  <label>Ngày bắt đầu thuê:</label>
                  <input type="date" name="rentStartDate" value={formData.rentStartDate} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="clause">
              <h4>Điều 2:</h4>
              <div className="form-group">
                <label>Giá tiền thuê phòng (đồng/tháng):</label>
                <input type="text" name="price" value={formData.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Bằng chữ:</label>
                <input type="text" name="priceText" value={formData.priceText} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Ngày thanh toán hàng tháng:</label>
                <input type="text" name="payDate" value={formData.payDate} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Tiền thế chân (số tiền):</label>
                <input type="text" name="deposit" value={formData.deposit} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Tiền thế chân (bằng chữ):</label>
                <input type="text" name="depositText" value={formData.depositText} onChange={handleChange} required />
              </div>
            </div>

            <div className="clause">
              <h4>Điều 3: Trách nhiệm bên A</h4>
              <ul>
                <li>Giao phòng trọ, trang thiết bị trong phòng trọ cho bên B đúng ngày ký hợp đồng.</li>
                <li>Hướng dẫn bên B chấp hành đúng các quy định của địa phương, hoàn tất mọi thủ tục giấy tờ đăng ký tạm trú cho bên B.</li>
              </ul>
            </div>

            <div className="clause">
              <h4>Điều 4: Trách nhiệm bên B</h4>
              <ul>
                <li>Trả tiền thuê phòng trọ hàng tháng theo hợp đồng.</li>
                <li>Sử dụng đúng mục đích thuê nhà, khi cần sửa chữa, cải tạo theo yêu cầu sử dụng riêng phải được sự đồng ý của bên A.</li>
                <li>Đồ đạt trang thiết bị trong phòng trọ phải có trách nhiệm bảo quản cẩn thận không làm hư hỏng mất mát.</li>
              </ul>
            </div>

            <div className="clause">
              <h4>Điều 5: Điều khoản chung</h4>
              <ul>
                <li>Bên A và bên B thực hiện đúng các điều khoản ghi trong hợp đồng.</li>
                <li>Trường hợp có tranh chấp hoặc một bên vi phạm hợp đồng thì hai bên cùng nhau bàn bạc giải quyết, nếu không giải quyết được thì yêu cầu cơ quan có thẩm quyền giải quyết.</li>
                <li>Hợp đồng được lập thành 02 bản có giá trị ngang nhau, mỗi bên giữ 01 bản.</li>
              </ul>
            </div>

            <div className="contract-date-row">
              <em>
                {(() => {
                  if (!formData.contractDate) return 'Đà Nẵng, ngày ... tháng ... năm 20...';
                  const d = new Date(formData.contractDate);
                  return `Đà Nẵng, ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`;
                })()}
              </em>
              <input
                type="date"
                name="contractDate"
                value={formData.contractDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="terms-confirm-row">
            <div className="terms-col">
              <div className="terms-desc">
                Bằng cách nhấp chuột vào nút "ĐỒNG Ý", Khách hàng xác nhận rằng mình đã đọc, hiểu và đồng ý với toàn bộ các điều kiện và điều khoản áp dụng của VoyAway. Vui lòng đọc kỹ trước khi tiếp tục sử dụng dịch vụ.
              </div>
              <label>
                <input type="checkbox" checked={agreeA} onChange={e => setAgreeA(e.target.checked)} />
                Tôi đã đọc và đồng ý với các điều khoản (Bên A)
              </label>
            </div>
            <div className="terms-col">
              <div className="terms-desc">
                Bằng cách nhấp chuột vào nút "ĐỒNG Ý", Chủ nhà xác nhận rằng mình đồng ý với các điều kiện và điều khoản mà VoyAway đưa ra, đồng thời cam kết tuân thủ các quy định khi cung cấp chỗ ở trên nền tảng.
              </div>
              <label>
                <input type="checkbox" checked={agreeB} onChange={e => setAgreeB(e.target.checked)} />
                Tôi đã đọc và đồng ý với các điều khoản (Bên B)
              </label>
            </div>
          </div>

          <div className="signatures">
            <div className="signature-block">
              <div>BÊN A</div>
              <div className="signature-container" onClick={() => document.getElementById('fileA').click()}>
                {formData.signatureA ? (
                  <img src={formData.signatureA} alt="Chữ ký bên A" className="signature-image" />
                ) : (
                  <span>Chọn ảnh chữ ký bên A</span>
                )}
              </div>
              <input
                type="file"
                id="fileA"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'signatureA')}
              />
            </div>
            <div className="signature-block">
              <div>BÊN B</div>
              <div className="signature-container" onClick={() => document.getElementById('fileB').click()}>
                {formData.signatureB ? (
                  <img src={formData.signatureB} alt="Chữ ký bên B" className="signature-image" />
                ) : (
                  <span>Chọn ảnh chữ ký bên B</span>
                )}
              </div>
              <input
                type="file"
                id="fileB"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'signatureB')}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">Gửi Hợp Đồng</button>
        </form>
      </div>
    </div>
  );
}

export default FormContracts;
