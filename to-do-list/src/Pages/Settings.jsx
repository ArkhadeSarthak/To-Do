import React, { useState, useEffect } from "react";
import userService from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaAt, FaCamera, FaSave, FaEdit, FaLock } from "react-icons/fa";
import "../styles/settings.css";

function Settings({ closeOpen, iconCLS }) {
  const { currentUser } = useAuth();
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    profilePicture: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.email) {
      fetchProfile();
    }
  }, [currentUser]);

  const fetchProfile = async () => {
    try {
      const data = await userService.getUserProfile(currentUser.email);
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await userService.updateUserProfile(user);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="settingsPage">Loading Profile...</div>;

  const initials = user.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="settingsPage">
      <div className="settingsHeader">
        <button className="btnWhite CloseOpen" onClick={closeOpen}>
          <i className={iconCLS}></i>
        </button>
        <h1 className="Heading settingsTitle">Settings</h1>
      </div>

      <div className="settingsContent">
        <div className="profileSection">
          <div className="profileImageContainer">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="profileImage" />
            ) : (
              <div className="profilePlaceholder">{initials}</div>
            )}
            {isEditing && (
              <label htmlFor="profilePicInput" className="cameraIcon">
                <FaCamera />
                <input
                  id="profilePicInput"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
          <div className="profileInfoSummary">
            <h2>{user.name}</h2>
            <p>@{user.username}</p>
          </div>
        </div>

        <div className="formSection">
          <div className="inputGroup">
            <label><FaUser /> Full Name</label>
            <input
              type="text"
              value={user.name}
              disabled={!isEditing}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Your Name"
            />
          </div>

          <div className="inputGroup">
            <label><FaAt /> Username</label>
            <input
              type="text"
              value={user.username}
              disabled={!isEditing}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              placeholder="username"
            />
          </div>

          <div className="inputGroup">
            <label><FaEnvelope /> Email Address</label>
            <input
              type="email"
              value={user.email}
              disabled={true} // Email shouldn't be changed as it's the unique ID
              placeholder="email@example.com"
            />
          </div>


          <div className="settingsActions">
            {isEditing ? (
              <button className="saveBtn" onClick={handleUpdate}>
                <FaSave /> Save Changes
              </button>
            ) : (
              <button className="editBtn" onClick={() => setIsEditing(true)}>
                <FaEdit /> Edit Profile
              </button>
            )}
            {isEditing && (
              <button className="cancelBtn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
