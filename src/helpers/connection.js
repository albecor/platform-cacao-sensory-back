const config = require('../config');
const mongoose = require('mongoose');

mongoose.connect(config.database.uri, {useNewUrlParser: true});

module.exports = mongoose.connection;
