import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { FaGoogle } from "react-icons/fa";
import userService from "../services/userService";
import "../styles/auth.css";

function SignUp() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update Firebase Profile Name
      await updateProfile(user, { displayName: name });

      // Sync with our backend
      await userService.updateUserProfile({
        name,
        username,
        email,
        password,
      });

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Sync Google User with backend
      await userService.updateUserProfile({
        name: user.displayName,
        username: user.email.split("@")[0],
        email: user.email,
        profilePicture: user.photoURL,
      });

      navigate("/");
    } catch (err) {
      setError("Google Login failed");
    }
  };

  return (
    <div className="authPage">
      <div className="authContainer">
        <h1>Create Account</h1>
        <p>Join us to stay organized</p>

        {error && <div className="authError">{error}</div>}

        <form className="authForm" onSubmit={handleSignUp}>
          <div className="authInputGroup">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="authInputGroup">
            <label>Username</label>
            <input 
              type="text" 
              placeholder="johndoe123" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="authInputGroup">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="email@example.com" 
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
          <button type="submit" className="authBtn">Create Account</button>
        </form>

        <button className="googleBtn" onClick={handleGoogleLogin}>
          <FaGoogle style={{ color: "#4285F4" }} /> Continue with Google
        </button>

        <div className="authFooter">
          Already have an account? <span onClick={() => navigate("/login")}>Login</span>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
