const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get User Profile by Email
router.get('/profile/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create or Update User Profile
router.put('/profile', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      user = new User(req.body);
    } else {
      user.name = req.body.name || user.name;
      user.username = req.body.username || user.username;
      user.password = req.body.password || user.password;
      user.profilePicture = req.body.profilePicture || user.profilePicture;
    }
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
