import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { FaGoogle } from "react-icons/fa";
import "../styles/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      setError("Google Login failed");
    }
  };

  return (
    <div className="authPage">
      <div className="authContainer">
        <h1>Welcome Back</h1>
        <p>Please enter your details to login</p>

        {error && <div className="authError">{error}</div>}

        <form className="authForm" onSubmit={handleLogin}>
          <div className="authInputGroup">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="authInputGroup">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="authBtn">Login</button>
        </form>

        <button className="googleBtn" onClick={handleGoogleLogin}>
          <FaGoogle style={{ color: "#4285F4" }} /> Continue with Google
        </button>

        <div className="authFooter">
          Don't have an account? <span onClick={() => navigate("/signup")}>Create Account</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
