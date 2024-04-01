/* eslint-disable no-invalid-this */
const mongoose = require('mongoose');

// eslint-disable-next-line new-cap
const FarmsSchema = mongoose.Schema({
  name: String,
  producer: {type: mongoose.Schema.Types.ObjectId, ref: 'producers'},
  state: String,
  city: String,
  altitude: Number,
  createdAt: {type: Date, default: new Date()},
  updatedAt: {type: Date, default: new Date()},
});

const FarmsModel = mongoose.model('farms', FarmsSchema);
module.exports = FarmsModel;
