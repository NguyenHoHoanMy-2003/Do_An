import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/MyContracts.scss';

const MyContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContracts = async () => {
      if (!user || !user.id_user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5001/contracts/renter/${user.id_user}`);
        const data = await response.json();

        if (response.ok) {
          setContracts(data);
        } else {
          setError(data.message || 'Failed to fetch contracts.');
          setContracts([]);
        }
      } catch (err) {
        console.error("Error fetching contracts:", err);
        setError('Error connecting to the server.');
        setContracts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [user, navigate]);

  const handleViewContract = (contractId) => {
    console.log("View contract with ID:", contractId);
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30.44);
    return `${diffMonths} tháng`;
  };

  return (
    <div>
      <Navbar />
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
          <div className="contracts-list">
            {contracts.map((contract) => (
              <div key={contract.id_contract} className="contract-form">
                <h2>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
                <h3>Độc Lập - Tự Do - Hạnh Phúc</h3>
                <div className="divider">---oOo---</div>
                <h2>HỢP ĐỒNG CHO THUÊ PHÒNG TRỌ</h2>

                <div className="section">
                  <h3>BÊN A: BÊN CHO THUÊ PHÒNG TRỌ (Host)</h3>
                  <div className="form-group">
                    <label>Họ và Tên:</label>
                    <p>{contract.room?.property?.host?.name || 'N/A'}</p>
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại:</label>
                    <p>{contract.room?.property?.host?.phone || 'N/A'}</p>
                  </div>
                  <div className="form-group">
                    <label>Địa chỉ liên quan:</label>
                    <p>{contract.room?.property?.street_address || 'N/A'}</p>
                  </div>
                </div>

                <div className="section">
                  <h3>BÊN B: BÊN THUÊ PHÒNG TRỌ (You)</h3>
                  <div className="form-group">
                    <label>Họ và Tên:</label>
                    <p>{contract.tenant?.name || 'N/A'}</p>
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại:</label>
                    <p>{contract.tenant?.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="section">
                  <h3>Hai bên cùng thỏa thuận và đồng ý với nội dung sau:</h3>
                  
                  <div className="clause">
                    <h4>Điều 1:</h4>
                    <div className="form-group">
                      <label>Địa chỉ phòng trọ:</label>
                      <p>{`${contract.room?.name || 'Phòng N/A'} - ${contract.room?.property?.name_bd || 'Tòa nhà N/A'}, ${contract.room?.property?.street_address || 'Địa chỉ N/A'}`}</p>
                    </div>
                    <div className="form-group row">
                      <div className="col">
                        <label>Thời hạn thuê:</label>
                        <p>{calculateDuration(contract.start_date, contract.end_date)}</p>
                      </div>
                      <div className="col">
                        <label>Ngày bắt đầu thuê:</label>
                        <p>{contract.start_date ? new Date(contract.start_date).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div className="col">
                        <label>Ngày kết thúc thuê:</label>
                        <p>{contract.end_date ? new Date(contract.end_date).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="clause">
                    <h4>Điều 2:</h4>
                    <div className="form-group">
                      <label>Giá tiền thuê phòng (đồng/tháng):</label>
                      <p>{contract.giaThue ? parseFloat(contract.giaThue).toLocaleString('vi-VN') + ' đ' : 'N/A'}</p>
                    </div>
                    <div className="form-group">
                      <label>Trạng thái hợp đồng:</label>
                      <p className={`status ${contract.status || 'pending'}`}>{contract.status || 'Pending'}</p>
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

                  <div className="contract-date">
                    <p>
                      Đà Nẵng, ngày {contract.start_date ? new Date(contract.start_date).getDate() : '...'} tháng {contract.start_date ? new Date(contract.start_date).getMonth() + 1 : '...'} năm {contract.start_date ? new Date(contract.start_date).getFullYear() : '...'}
                    </p>
                  </div>

                  <div className="signatures">
                    <div className="signature-block">
                      <div>BÊN A</div>
                      <div className="signature-line"></div>
                    </div>
                    <div className="signature-block">
                      <div>BÊN B</div>
                      <div className="signature-line"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyContracts; 