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
  const [step, setStep] = useState(1)
  const [otp, setOtp] = useState("")
  
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
  
    try {
      const response = await fetch("http://localhost:5001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, phone, password, confirmPassword })
      });
  
      const result = await response.json();
  
      if (response.ok && result.success) {
        setStep(2); // Move to OTP step
        setErrorMessage("");
      } else {
        setErrorMessage(result.message || "Registration failed!");
      }
    } catch (err) {
      console.log("Registration failed", err.message);
      setErrorMessage("Internal server error!");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone, otp })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        setErrorMessage(result.message || "OTP verification failed!");
      }
    } catch (err) {
      console.log("OTP verification failed", err.message);
      setErrorMessage("Internal server error!");
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch("http://localhost:5001/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("OTP resent successfully!");
      } else {
        setErrorMessage(result.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.log("Resend OTP failed", err.message);
      setErrorMessage("Internal server error!");
    }
  };

  return (
    <div className='register'>
      <div className='register_content'>
        {step === 1 ? (
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
        ) : (
          <form className='register_content_form' onSubmit={handleVerifyOtp}>
            <p>Enter OTP sent to {phone}</p>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit">Verify OTP</button>
            <button type="button" onClick={handleResendOtp}>Resend OTP</button>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </form>
        )}

        {step === 1 && (
          <>
            <div className="register_or">
              <hr className="register_or_divider" />
              <span className="register_or_text">OR</span>
              <hr className="register_or_divider" />
            </div>

            <div className="register_socials">
              <div className="register_socials_item">
                <img src="/assets/google.png" alt="Google" />
              </div>
              <div className="register_socials_item">
                <img src="/assets/Facebook-icon-1.png" alt="Facebook" />
              </div>
            </div>
          </>
        )}

        <div className="register_links">
          <a href="/login">Already have an account? Log in here</a>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage