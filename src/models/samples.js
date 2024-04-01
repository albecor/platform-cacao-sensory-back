/* eslint-disable no-invalid-this */
const mongoose = require('mongoose');

// eslint-disable-next-line new-cap
const SamplesSchema = mongoose.Schema({
  code: {type: String, unique: true, required: true},
  altitude: Number,
  variety: String,
  producer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'producers',
    required: true,
  },
  farm: {type: mongoose.Schema.Types.ObjectId, ref: 'farms'},
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  createdAt: {type: Date, default: new Date()},
  updatedAt: {type: Date, default: new Date()},
});

SamplesSchema.pre('remove', function(next) {
  const sample = this;
  sample.model('results').remove({sample: sample._id}, next);
});

const SamplesModel = mongoose.model('samples', SamplesSchema);
module.exports = SamplesModel;
