const mongoose = require('mongoose');

// eslint-disable-next-line new-cap
const SampleStatesSchema = mongoose.Schema({
  name: String,
  description: String,
  label: String,
  list: String,
  icon: String,
  order: Number,
});

const SampleStatesModel = mongoose.model('samplestates', SampleStatesSchema);
module.exports = SampleStatesModel;
