import React, { useState, useEffect } from "react";
import "../styles/InfoManagement.scss";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";

const InfoManagement = () => {
  // Giả sử userId lấy từ localStorage hoặc hardcode tạm
  const userId = useSelector(state => state.user?.user?.id_user) || localStorage.getItem("userId");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    name: "",
    email: "",
    dob: "",
    cccd: "",
    issueDate: "",
    placeOfIssue: "",
    address: ""
  });
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch user info khi vào trang (chỉ lấy phone, name, password)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5001/users/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setFormData(prev => ({
            ...prev,
            phone: data.phone || "",
            name: data.name || "",
            password: data.password || ""
          }));
        }
      } catch (err) {
        // Có thể show lỗi
      }
      setLoading(false);
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      // Gọi API update user
      try {
        await fetch(`http://localhost:5001/users/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        setSuccessMsg("Cập nhật thông tin thành công!");
        setTimeout(() => setSuccessMsg(""), 2000);
      } catch (err) {
        // Có thể show lỗi
      }
    }
    setIsEditing(!isEditing);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="info-container">
        <h2>Personal Information</h2>
        {successMsg && <div className="success-message">{successMsg}</div>}
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
          <div className="form-row">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={!isEditing}
            />
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
          <button type="submit" className="edit-button">
            {isEditing ? "Save" : "Edit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InfoManagement;
