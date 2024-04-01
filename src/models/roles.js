const mongoose = require('mongoose');

// eslint-disable-next-line new-cap
const RolesSchema = mongoose.Schema({
  name: String,
  description: String,
});

const RolesModel = mongoose.model('roles', RolesSchema);
module.exports = RolesModel;
