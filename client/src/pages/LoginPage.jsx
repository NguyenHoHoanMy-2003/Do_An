import React, { useState } from 'react';
import "../styles/Login.scss";
import { setLogin } from '../redux/state';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👈 Thêm icon con mắt
import { useSelector } from "react-redux";


const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 Trạng thái ẩn/hiện mật khẩu
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxUser = useSelector((state) => state.user.user);
  console.log("Redux user state:", reduxUser);  // 👈 XEM TRONG CONSOLE

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };
    
    const validateInputs = () => {
      const newErrors = {};
  
      if (!phone.trim()) {
        newErrors.phone = "Số điện thoại không được để trống";
      }
      if (!password.trim()) {
        newErrors.password = "Mật khẩu không được để trống";
      }
  
      const phoneRegex = /^[0-9]{9,12}$/;
      const passwordRegex = /^[a-zA-Z0-9]+$/;
  
      if (phone && !phoneRegex.test(phone)) {
        newErrors.phone = "Số điện thoại không hợp lệ";
      }
      if (password && !passwordRegex.test(password)) {
        newErrors.password = "Mật khẩu không được chứa ký tự đặc biệt";
      }
  
      if (/\s/.test(phone)) {
        newErrors.phone = "Số điện thoại không được chứa khoảng trắng";
      }
      if (/\s/.test(password)) {
        newErrors.password = "Mật khẩu không được chứa khoảng trắng";
      }
  
      if (password.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      }
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setServerError("");
  
      if (!validateInputs()) return;
  
    try {
      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone, password })
      });

      const result = await response.json();
      console.log("RESULT FROM SERVER:", result); // 👈 THÊM DÒNG NÀY

      if (response.ok) {
        console.log("✅ result.user:", result.user); // 👈 thêm dòng này để kiểm tra
        dispatch(setLogin({
          user: {
            id_user: result.user?.id_user,
            name: result.user?.name,
            role: result.user?.role, // Thêm dòng này để lưu role vào redux
          },
          token: result.token
        }));
        localStorage.setItem("token", result.token);
        navigate("/");
      } else {
        setServerError(result.message || "Đăng nhập thất bại!");
      }
    } catch (err) {
      setServerError("Lỗi kết nối đến server.");
      console.error("Login failed", err.message);
    }
  };

  return (
    <div className='login'>
      <div className='login_content'>
        <form className='login_content_form' onSubmit={handleSubmit}>
          <input
            name="phone"
            type="tel"
            placeholder='Số điện thoại'
            className="input-field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}

          <div className="password-field">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

          <button name ="login_button" type="submit">Đăng nhập</button>
          {serverError && <p style={{ color: "red" }}>{serverError}</p>}
        </form>

        <div className="login_or">
          <hr className="login_or_divider" />
          <span className="login_or_text">OR</span>
          <hr className="login_or_divider" />
        </div>

        <div className="login_socials">
          <div className="login_socials_item">
            <img src="/assets/google.png" alt="Google" />
          </div>
          <div className="login_socials_item">
            <img src="/assets/Facebook-icon-1.png" alt="Facebook" />
          </div>
        </div>

        <div className="login_links">
          <a href="/">Main page</a>
            <a href="/register">Don't have an account? Sign up here</a>
          </div>
      </div>
    </div>
  );
};

export default LoginPage;