import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";
import Modal from "../Modals/loginModal.jsx"; // Import the Modal component
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear any previous error

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { token, role } = response.data;
      localStorage.setItem("token", token); // Store token in localStorage
      localStorage.setItem("role", role); // Store role in localStorage

      if (role === "admin") {
        navigate("/dashboard"); // Navigate to dashboard for admin
      } else {
        navigate("/"); // Navigate to home page for regular user
      }
    } catch (err) {
      console.error("Login failed", err);
      setError("Failed to log in");
    }
  };

  const handleCloseModal = () => {
    setError(""); // Clear error message on modal close
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label className="form-label">Email:</label>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <label className="form-label">Password:</label>
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="login-button">
            Login
          </button>
          <button
            type="button"
            className="sign-up-button"
            onClick={() => (window.location.href = "/signup")}
          >
            Sign Up
          </button>
        </div>
      </form>
      {error && <Modal message={error} onClose={handleCloseModal} />}
    </div>
  );
};

export default Login;
