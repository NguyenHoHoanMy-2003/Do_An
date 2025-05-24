import React, { useState } from 'react'
import "../styles/Register.scss"
import { useNavigate } from 'react-router-dom'

const RegisterPage = () => {
  const [name, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  
  const navigate = useNavigate()

  const handlePhoneChange = (e) => {
    const value = e.target.value
    const regex = /^[0-9]*$/

    if (!regex.test(value)) {
      setPhoneError("Only numbers are allowed!")
    } else {
      setPhoneError("")
    }

    setPhone(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (phoneError || password !== confirmPassword) {
      setErrorMessage("Make sure all fields are correct!");
      return;
    }
  
    console.log({name, phone, password, confirmPassword });  // Thêm dòng này để kiểm tra dữ liệu
  
    try {
      const response = await fetch("http://localhost:5001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, phone, password, confirmPassword })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        navigate("/login");  // Redirect to login page after successful registration
      } else {
        setErrorMessage(result.message || "Registration failed!");
      }
    } catch (err) {
      console.log("Registration failed", err.message);
      setErrorMessage("Internal server error!");
    }
  };
  

  return (
    <div className='register'>
      <div className='register_content'>
        <form className='register_content_form' onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={handlePhoneChange}
            required
          />
          {phoneError && <p style={{ color: "red" }}>{phoneError}</p>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
        <div className="register_links">
          <a href="/login">Already have an account? Log in here</a>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
