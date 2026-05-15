const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Store for reference as requested
  profilePicture: { type: String, default: '' },
});

module.exports = mongoose.model('User', UserSchema);
