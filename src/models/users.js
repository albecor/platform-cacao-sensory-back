const mongoose = require('mongoose');

// eslint-disable-next-line new-cap
const UserSchema = mongoose.Schema({
  email: {type: String, unique: true, required: true, trim: true},
  name: {type: String, required: true},
  hash: {type: String, required: true},
  salt: {type: String, required: true},
  mobile: Number,
  document: Number,
  rol: {type: mongoose.Schema.Types.ObjectId, ref: 'roles', required: true},
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {type: Date, default: new Date()},
  updatedAt: {type: Date, default: new Date()},
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
