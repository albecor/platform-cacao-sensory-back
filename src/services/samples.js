const Samples = require('../models/samples');
const Process = require('../models/process');
const Events = require('../models/events');
require('../models/producers');
const Mongoose = require('mongoose');
const {inspect} = require('util');
const {defaultError, badRequest} = require('./errors');
const {getStates, getById} = require('./states');
const {getInfo} = require('./users');
const {database} = require('../config');
const {renderTemplate, sendEmail} = require('../helpers/email');
const EventService = require('./events');
const ProcessService = require('./process');

exports.getAll = async () => {
  try {
    return Process
        .aggregate([
          {
            '$lookup': {
              'from': 'samples',
              'localField': 'sample',
              'foreignField': '_id',
              'as': 'sample',
            },
          }, {
            '$lookup': {
              'from': 'samplestates',
              'localField': 'state',
              'foreignField': '_id',
              'as': 'state',
            },
          }, {
            '$unwind': {
              'path': '$sample',
            },
          }, {
            '$unwind': {
              'path': '$state',
            },
          }, {
            '$lookup': {
              'from': 'producers',
              'localField': 'sample.producer',
              'foreignField': '_id',
              'as': 'producer',
            },
          }, {
            '$unwind': {
              'path': '$producer',
            },
          }, {
            '$group': {
              '_id': '$sample._id',
              'order': {
                '$max': '$state.order',
              },
              'info': {
                '$push': {
                  'sample': '$sample',
                  'state': '$state',
                  'producer': '$producer',
                },
              },
            },
          }, {
            '$project': {
              'order': 1,
              'info': {
                '$setDifference': [
                  {
                    '$map': {
                      'input': '$info',
                      'as': 'info',
                      'in': {
                        '$cond': [
                          {
                            '$eq': [
                              '$$info.state.order', '$order',
                            ],
                          }, '$$info', false,
                        ],
                      },
                    },
                  }, [
                    false,
                  ],
                ],
              },
            },
          }, {
            '$unwind': {
              'path': '$info',
            },
          }, {
            '$project': {
              'code': '$info.sample.code',
              'producer': '$info.producer.name',
              'state': '$info.state',
            },
          }, {
            '$sort': {
              'code': -1,
            },
          },
        ])
        .exec();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.getReadyForSensory = async () => {
  try {
    const samplesInEvent = await Events.aggregate([
      {
        '$project': {
          'samples': 1,
          '_id': 0,
        },
      }, {
        '$group': {
          '_id': '$samples',
        },
      },
    ]).exec();
    return Process
        .aggregate([
          {
            '$match': {
              'sample': {'$nin': samplesInEvent.map(s => s._id).flat()},
            },
          },
          {
            '$lookup': {
              'from': 'samplestates',
              'localField': 'state',
              'foreignField': '_id',
              'as': 'state',
            },
          }, {
            '$lookup': {
              'from': 'samples',
              'localField': 'sample',
              'foreignField': '_id',
              'as': 'sample',
            },
          }, {
            '$sort': {
              'state.order': 1,
            },
          }, {
            '$group': {
              '_id': '$sample',
              'y': {
                '$last': '$state',
              },
            },
          }, {
            '$match': {
              'y.order': 6,
            },
          }, {
            '$lookup': {
              'from': 'producers',
              'localField': '_id.producer',
              'foreignField': '_id',
              'as': 'producer',
            },
          }, {
            '$project': {
              '_id': {
                '$arrayElemAt': [
                  '$_id._id', 0,
                ],
              },
              'code': {
                '$arrayElemAt': [
                  '$_id.code', 0,
                ],
              },
              'producer': {
                '$arrayElemAt': [
                  '$producer.name', 0,
                ],
              },
            },
          },
        ])
        .exec();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.getOne = async ({id}) => {
  try {
    const sample = await Samples
        .findById(id)
        .populate({path: 'producer', select: {'_id': 1, 'name': 1}})
        .populate({path: 'farm', select: {'_id': 1, 'name': 1}})
        .exec();
    const process = await Process
        .aggregate([
          {
            '$match': {
              // eslint-disable-next-line new-cap
              'sample': Mongoose.Types.ObjectId(id),
            },
          }, {
            '$lookup': {
              'from': 'users',
              'localField': 'owner',
              'foreignField': '_id',
              'as': 'owner',
            },
          }, {
            '$lookup': {
              'from': 'samplestates',
              'localField': 'state',
              'foreignField': '_id',
              'as': 'state',
            },
          }, {
            '$project': {
              'owner': {
                '$arrayElemAt': [
                  '$owner', 0,
                ],
              },
              'state': {
                '$arrayElemAt': [
                  '$state', 0,
                ],
              },
              'startAt': {
                '$dateToString': {
                  'format': '%Y-%m-%d %H:%M',
                  'date': '$startAt',
                  'timezone': 'America/Bogota',
                },
              },
              'notes': 1,
              'endAt': {
                '$dateToString': {
                  'format': '%Y-%m-%d %H:%M',
                  'date': '$endAt',
                  'timezone': 'America/Bogota',
                },
              },
            },
          }, {
            '$project': {
              'owner.name': 1,
              'owner._id': 1,
              'state': 1,
              'startAt': 1,
              'notes': 1,
              'endAt': 1,
            },
          },
        ])
        .exec();
    return {process, sample};
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.getReport = async ({id}) => {
  try {
    const values = await Events
        .aggregate([
          {
            '$match': {
              'samplesCompleted': {
                '$in': [id],
              },
            },
          }, {
            '$project': {
              'results': 1,
              'a': {
                '$objectToArray': '$results',
              },
            },
          }, {
            '$project': {
              'a': {
                '$filter': {
                  'input': '$a',
                  'as': 'el',
                  'cond': {
                    '$eq': [
                      '$$el.k', id,
                    ],
                  },
                },
              },
            },
          }, {
            '$project': {
              'a': {
                '$first': '$a',
              },
            },
          }, {
            '$project': {
              'a': {
                '$objectToArray': '$a.v',
              },
            },
          }, {
            '$project': {
              'a': {
                '$map': {
                  'input': '$a',
                  'as': 'decimalValue',
                  'in': '$$decimalValue.v',
                },
              },
            },
          }, {
            '$project': {
              'smell': {
                '$map': {
                  'input': '$a',
                  'as': 'asd',
                  'in': '$$asd.smell',
                },
              },
              'acidity': {
                '$map': {
                  'input': '$a',
                  'as': 'asd',
                  'in': '$$asd.acidity',
                },
              },
              'bitterness': {
                '$map': {
                  'input': '$a',
                  'as': 'asd',
                  'in': '$$asd.bitterness',
                },
              },
              'astringency': {
                '$map': {
                  'input': '$a',
                  'as': 'asd',
                  'in': '$$asd.astringency',
                },
              },
              'defects': {
                '$map': {
                  'input': '$a',
                  'as': 'asd',
                  'in': '$$asd.defects',
                },
              },
              'flavor': {
                '$map': {
                  'input': '$a',
                  'as': 'asd',
                  'in': '$$asd.flavor',
                },
              },
              'aftertaste': {
                '$map': {
                  'input': '$a',
                  'as': 'asd',
                  'in': '$$asd.aftertaste',
                },
              },
              'points': {
                '$map': {
                  'input': '$a',
                  'as': 'asd',
                  'in': '$$asd.points',
                },
              },
              'comments': {
                '$map': {
                  'input': '$a',
                  'as': 'asd',
                  'in': '$$asd.comments',
                },
              },
            },
          }, {
            '$project': {
              'smell': 1,
              'acidity': 1,
              'bitterness': 1,
              'astringency': 1,
              'defects': 1,
              'flavor': 1,
              'aftertaste': 1,
              'points': 1,
              'comments': 1,
              'smellAvg': {
                '$avg': {
                  '$map': {
                    'input': '$smell',
                    'as': 'a',
                    'in': '$$a.quality',
                  },
                },
              },
              'acidityAvg': {
                '$avg': {
                  '$map': {
                    'input': '$acidity',
                    'as': 'a',
                    'in': '$$a.quality',
                  },
                },
              },
              'bitternessAvg': {
                '$avg': {
                  '$map': {
                    'input': '$bitterness',
                    'as': 'a',
                    'in': '$$a.quality',
                  },
                },
              },
              'astringencyAvg': {
                '$avg': {
                  '$map': {
                    'input': '$astringency',
                    'as': 'a',
                    'in': '$$a.quality',
                  },
                },
              },
              'defectsAvg': {
                '$avg': {
                  '$map': {
                    'input': '$defects',
                    'as': 'a',
                    'in': '$$a.quality',
                  },
                },
              },
              'flavorAvg': {
                '$avg': {
                  '$map': {
                    'input': '$flavor',
                    'as': 'a',
                    'in': '$$a.quality',
                  },
                },
              },
              'aftertasteAvg': {
                '$avg': {
                  '$map': {
                    'input': '$aftertaste',
                    'as': 'a',
                    'in': '$$a.quality',
                  },
                },
              },
              'pointsAvg': {
                '$avg': {
                  '$map': {
                    'input': '$points',
                    'as': 'a',
                    'in': '$$a.value',
                  },
                },
              },
            },
          }, {
            '$project': {
              'smell': 1,
              'acidity': 1,
              'bitterness': 1,
              'astringency': 1,
              'defects': 1,
              'flavor': 1,
              'aftertaste': 1,
              'points': 1,
              'comments': 1,
              'smellAvg': 1,
              'acidityAvg': 1,
              'bitternessAvg': 1,
              'astringencyAvg': 1,
              'defectsAvg': 1,
              'flavorAvg': 1,
              'aftertasteAvg': 1,
              'pointsAvg': 1,
              'total': {
                $sum: [
                  '$smellAvg',
                  '$acidityAvg',
                  '$bitternessAvg',
                  '$astringencyAvg',
                  '$aftertasteAvg',
                  '$pointsAvg',
                  {$multiply: ['$defectsAvg', 2]},
                  {$multiply: ['$flavorAvg', 2]},
                ],
              },
            },
          },
        ])
        .exec();
    const process = await Process.aggregate([
      {
        '$match': {
          // eslint-disable-next-line new-cap
          'sample': Mongoose.Types.ObjectId(id),
        },
      }, {
        '$lookup': {
          'from': 'samplestates',
          'localField': 'state',
          'foreignField': '_id',
          'as': 'state',
        },
      }, {
        '$match': {
          'state.order': {
            '$lte': 2,
          },
          'notes': {
            '$ne': null,
          },
        },
      }, {
        '$project': {
          'notes': 1,
        },
      },
    ]).exec();
    const sample = await Samples
        .findById(id)
        .populate({path: 'producer'})
        .populate({path: 'farm'})
        .exec();
    return {sample, values: values[0], process: process[0]};
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.create = async (user, {process, sample}) => {
  try {
    const owner = await getInfo({id: process.owner}) || {};
    const currentState = await getById(process.state);
    if (
      currentState.order < 6 &&
      database.roles.includes(owner.rol?.name)
    ) {
      throw defaultError('Estado o responsable incorrectos');
    }
    sample.createdBy = user.id;
    const newSample = new Samples(sample);
    const snapshot = await newSample.save();
    if (currentState.order - 1) {
      const prevState = await getStates(
          {
            hasFilter: true,
            params: {order: currentState.order - 1},
          });
      const oldieProcess = {
        owner: user.id,
        endAt: new Date(),
        state: prevState[0]._id,
        sample: snapshot._id,
        notes: process.notes,
      };
      const prevProcess = new Process(oldieProcess);
      await prevProcess.save();
    }
    const newbieProcess = {
      owner: process.owner || user.id,
      state: process.state,
      sample: snapshot._id,
    };
    const newProcess = new Process(newbieProcess);
    await newProcess.save();
    if (owner.email) {
      const info = {email: owner.email, subject: 'Nueva muestra'};
      const html = await renderTemplate('new-process', {
        state: currentState.label,
      });
      await sendEmail(html, info);
    }
  } catch (e) {
    console.error(inspect(e));
    if (e.message.includes('E11000')) throw badRequest('Código duplicado');
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.edit = async ({id}, data) => {
  try {
    await Samples.findByIdAndUpdate(id, data).exec();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.editMultiple = async body => {
  try {
    const {event, ...data} = body;
    const {info} = await EventService.getOne({id: event});
    info.samples.map(async s => {
      const sample = await exports.getOne({id: s._id.toString()});
      await Process
          .findByIdAndUpdate(
              sample.process.find(p => p.endAt === null)._id,
              {endAt: new Date()},
          ).exec();
      await ProcessService.create({...data, sample: s._id});
    });
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.deleteOne = async ({id}) => {
  try {
    await Samples.findByIdAndDelete(id).exec();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};
