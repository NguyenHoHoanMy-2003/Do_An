import React, { useState, useEffect } from "react";
import "../styles/InfoManagement.scss";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

const InfoManagement = () => {
  const userId = useSelector(state => state.user?.user?.id_user) || localStorage.getItem("userId");
  const token = useSelector(state => state.user.token);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isEditDisabled, setIsEditDisabled] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    name: "",
    email: "",
    dob: "",
    gender: "",
    cccd: "",
    issueDate: "",
    placeOfIssue: "",
    address: ""
  });
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    console.log("Current userId:", userId);
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:5001/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          console.log("User data fetched successfully:", data);
          setFormData({
            phone: data.phone || "",
            password: data.password || "",
            name: data.name || "",
            email: data.email || "",
            dob: data.date_of_birth ? new Date(data.date_of_birth).toISOString().split('T')[0] : "",
            gender: data.gender || "",
            cccd: data.national_id || "",
            issueDate: data.date_of_issue ? new Date(data.date_of_issue).toISOString().split('T')[0] : "",
            placeOfIssue: data.place_of_issue || "",
            address: data.permanent_address || ""
          });
        } else {
          const errorData = await res.json();
          setErrorMsg(errorData.message || "Không thể tải thông tin người dùng.");
        }
      } catch (err) {
        console.error("Lỗi fetch user:", err);
        setErrorMsg("Lỗi kết nối server.");
      }
      setLoading(false);
    };
    if (userId) {
      fetchUser();
    } else {
      setLoading(false);
      setErrorMsg("Không tìm thấy ID người dùng.");
    }
  }, [userId, token]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = () => {
    if (!isEditDisabled) {
      setIsEditing(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      setShowConfirmPopup(true);
    } else {
      handleEdit();
    }
  };

  const handleConfirmSave = async () => {
    setSuccessMsg("");
    setErrorMsg("");
    if (!token) return;
    try {
      const updateData = { ...formData };
      const res = await fetch(`http://localhost:5001/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData)
      });

      if (res.ok) {
        setSuccessMsg("Cập nhật thông tin thành công!");
        setIsEditing(false);
        setIsEditDisabled(true);
        setShowConfirmPopup(false);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        const errorData = await res.json();
        setErrorMsg(errorData.message || "Cập nhật thông tin thất bại.");
      }
    } catch (err) {
      console.error("Lỗi update user:", err);
      setErrorMsg("Lỗi kết nối server.");
    }
  };

  const handleCancelSave = () => {
    setShowConfirmPopup(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="info-container">
        <h2>Personal Information</h2>
        {successMsg && <div className="success-message">{successMsg}</div>}
        {errorMsg && <div className="error-message">{errorMsg}</div>}
        <form className="info-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Phone Number:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-row password-field">
            <label>Password:</label>
            <div className="password-input-container">
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="form-row">
            <label>Full Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-row">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-row">
            <label>Date Of Birth:</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-row">
            <label>Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div className="form-row">
            <label>CCCD:</label>
            <input
              type="text"
              name="cccd"
              value={formData.cccd}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-row">
            <label>Date of Issue:</label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-row">
            <label>Place of Issue:</label>
            <input
              type="text"
              name="placeOfIssue"
              value={formData.placeOfIssue}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-row">
            <label>Permanent Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <button 
            type="submit" 
            className={`edit-button ${isEditDisabled ? 'disabled' : ''}`}
            disabled={isEditDisabled}
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </form>

        {showConfirmPopup && (
          <div className="confirm-popup-overlay">
            <div className="confirm-popup">
              <h3>Xác nhận cập nhật</h3>
              <p>Bạn có chắc chắn muốn lưu thông tin?</p>
              <div className="warning-message">
                Sau khi save thì sẽ không được sửa gì nữa và vô hiệu button edit
              </div>
              <div className="confirm-buttons">
                <button onClick={handleConfirmSave} className="confirm-yes">Có</button>
                <button onClick={handleCancelSave} className="confirm-no">Không</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoManagement;
