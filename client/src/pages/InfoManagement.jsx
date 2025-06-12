import React, { useState, useEffect } from "react";
import "../styles/InfoManagement.scss";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const InfoManagement = () => {
  const userId =
    useSelector((state) => state.user?.user?.id_user) ||
    localStorage.getItem("userId");
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
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
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5001/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            phone: data.phone || "",
            password: data.password || "",
            name: data.name || "",
            email: data.email || "",
            dob:
              data.date_of_birth && !isNaN(new Date(data.date_of_birth))
                ? new Date(data.date_of_birth).toISOString().split("T")[0]
                : "",
            gender: data.gender || "",
            cccd: data.national_id || "",
            issueDate:
              data.date_of_issue && !isNaN(new Date(data.date_of_issue))
                ? new Date(data.date_of_issue).toISOString().split("T")[0]
                : "",
            placeOfIssue: data.place_of_issue || "",
            address: data.permanent_address || "",
          });
          if (isUserInfoComplete(data)) {
            setIsEditing(false);
            setCanEdit(false);
          } else {
            setIsEditing(true);
            setCanEdit(true);
          }
        } else {
          const errorData = await res.json();
          setErrorMsg(
            errorData.message || "Không thể tải thông tin người dùng."
          );
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
  }, [userId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (
      !formData.phone ||
      !formData.password ||
      !formData.name ||
      !formData.cccd ||
      !formData.issueDate ||
      !formData.placeOfIssue ||
      !formData.address
    ) {
      setErrorMsg("Vui lòng nhập đầy đủ tất cả các trường bắt buộc.");
      return false;
    }
    if (!/^\d{12}$/.test(formData.cccd)) {
      setErrorMsg("CCCD phải đủ 12 số.");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirmPopup(true);
  };

  const handleConfirmSave = async () => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const updateData = { ...formData };
      const res = await fetch(`http://localhost:5001/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        setSuccessMsg("Cập nhật thông tin thành công!");
        setIsEditing(false);
        setCanEdit(false);
        setShowConfirmPopup(false);
        setTimeout(() => {
          navigate("/");
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

  const isUserInfoComplete = (data) => {
    return (
      data.phone &&
      data.password &&
      data.name &&
      data.national_id &&
      /^\d{12}$/.test(data.national_id) &&
      data.date_of_issue &&
      data.place_of_issue &&
      data.permanent_address
    );
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
          {canEdit && (
            <button type="submit" className="edit-button">
              Save
            </button>
          )}
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
                <button onClick={handleConfirmSave} className="confirm-yes">
                  Có
                </button>
                <button onClick={handleCancelSave} className="confirm-no">
                  Không
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoManagement;
