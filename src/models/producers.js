/* eslint-disable no-invalid-this */
const mongoose = require('mongoose');

// eslint-disable-next-line new-cap
const ProducersSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  document: Number,
  email: String,
  variety: String,
  phone: Number,
  createdAt: {type: Date, default: new Date()},
  updatedAt: {type: Date, default: new Date()},
});

ProducersSchema.pre('remove', function(next) {
  const producer = this;
  producer.model('samples').remove({producer: producer._id}, next);
  producer.model('farms').remove({producer: producer._id}, next);
});

const ProducersModel = mongoose.model('producers', ProducersSchema);
module.exports = ProducersModel;
