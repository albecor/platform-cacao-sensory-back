/* eslint-disable no-invalid-this */
const mongoose = require('mongoose');

// eslint-disable-next-line new-cap
const ProcessSchema = mongoose.Schema({
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'samplestates',
    required: true,
  },
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
  sample: {type: mongoose.Schema.Types.ObjectId, ref: 'samples'},
  data: {type: Map},
  notes: {type: String},
  startAt: {type: Date, default: new Date()},
  prevProcess: {type: mongoose.Schema.Types.ObjectId, ref: 'process'},
  endAt: {type: Date},
});

ProcessSchema.pre('updateOne', function() {
  this.set({endAt: new Date()});
});

const ProcessModel = mongoose.model('process', ProcessSchema);
module.exports = ProcessModel;
