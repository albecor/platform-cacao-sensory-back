const Samples = require('../models/samples');
const Process = require('../models/process');
require('../models/samplestates');
const {inspect} = require('util');
const {defaultError} = require('./errors');

exports.getInfo = async () => {
  try {
    const process = await Process.aggregate([
      {
        '$lookup': {
          'from': 'samplestates',
          'localField': 'state',
          'foreignField': '_id',
          'as': 'state',
        },
      }, {
        '$unwind': {
          'path': '$state',
        },
      }, {
        '$group': {
          '_id': '$sample',
          'maxState': {
            '$max': '$state.order',
          },
        },
      }, {
        '$group': {
          '_id': '$maxState',
          'total': {
            '$sum': 1,
          },
        },
      }, {
        '$sort': {
          '_id': 1,
        },
      }, {
        '$lookup': {
          'from': 'samplestates',
          'localField': '_id',
          'foreignField': 'order',
          'as': 'state',
        },
      }, {
        '$unwind': {
          'path': '$state',
        },
      },
    ]).exec();
    const samples = await Samples.aggregate([{'$count': 'count'}]).exec();
    return {process, samples};
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};
