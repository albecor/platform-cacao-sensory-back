/* eslint-disable no-invalid-this */
const mongoose = require('mongoose');

// eslint-disable-next-line new-cap
const EventsSchema = mongoose.Schema({
  activated: {type: Boolean, default: false},
  samples: [{type: mongoose.Schema.Types.ObjectId, ref: 'samples'}],
  samplesCompleted: [String],
  testers: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
  leader: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  results: Map,
  startAt: {type: Date, default: new Date()},
  notes: String,
  endAt: {type: Date},
});

EventsSchema.pre('updateOne', function() {
  this.set({endAt: new Date()});
});

const EventsModel = mongoose.model('events', EventsSchema);
module.exports = EventsModel;
