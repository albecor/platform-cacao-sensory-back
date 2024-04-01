const Mongoose = require('mongoose');
const Process = require('../models/process');
const States = require('../models/samplestates');
const Samples = require('../models/samples');
const Users = require('../models/users');
const {inspect} = require('util');
const {defaultError} = require('./errors');
const {renderTemplate, sendEmail} = require('../helpers/email');

exports.getAll = async () => {
  try {
    return Process
        .find({})
        .populate('state')
        .populate({
          path: 'user',
          select: {'document': 1, 'email': 1, 'name': 1},
        })
        .exec();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.actived = async ({id}) => {
  try {
    return Process
        .aggregate([
          {
            '$match': {
              // eslint-disable-next-line new-cap
              'owner': Mongoose.Types.ObjectId(id),
              'endAt': null,
            },
          }, {
            '$lookup': {
              'from': 'processes',
              'localField': 'prevProcess',
              'foreignField': '_id',
              'as': 'prevProcess',
            },
          }, {
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
            '$project': {
              'sample': {
                '$first': '$sample.code',
              },
              'startAt': {
                '$dateToString': {
                  'format': '%Y-%m-%d %H:%M',
                  'date': '$startAt',
                  'timezone': 'America/Bogota',
                },
              },
              'state': {
                '$first': '$state',
              },
              'notes': {
                '$first': '$prevProcess.notes',
              },
            },
          }, {
            '$match': {
              'state.order': {
                '$lt': 7,
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

exports.byOwner = async ({id}) => {
  try {
    const list = await Process
        .aggregate([
          {
            '$match': {
              // eslint-disable-next-line new-cap
              'owner': Mongoose.Types.ObjectId(id),
              'endAt': {
                '$ne': null,
              },
            },
          }, {
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
            '$project': {
              'endAt': {
                '$dateToString': {
                  'format': '%Y-%m-%d %H:%M',
                  'date': '$startAt',
                  'timezone': 'America/Bogota',
                },
              },
              'sample': {
                '$first': '$sample.code',
              },
              'sampleId': {
                '$first': '$sample._id',
              },
              'startAt': {
                '$dateToString': {
                  'format': '%Y-%m-%d %H:%M',
                  'date': '$startAt',
                  'timezone': 'America/Bogota',
                },
              },
              'state': {
                '$first': '$state',
              },
              'notes': 1,
            },
          },
        ])
        .exec();
    const process = list.reduce((r, {sampleId, sample, ...rest}, index) => {
      if (!r[sampleId]) r[sampleId] = {sampleId, sample, data: [rest]};
      else r[sampleId].data.push(rest);
      return r;
    }, {});
    return Object.values(process);
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.getOne = async ({id}) => {
  try {
    return Process
        .findById(id)
        .populate('state')
        .populate({
          path: 'user',
          select: {'document': 1, 'email': 1, 'name': 1},
        })
        .exec();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.create = async data => {
  try {
    const newProcess = new Process(data);
    await newProcess.save();
  } catch (e) {
    console.error(inspect(e));
    throw defaultError('Estado o responsable incorrectos');
  }
};

exports.updateProcess = async ({id}, body) => {
  try {
    const data = {endAt: new Date()};
    if (body.notes) {
      data.notes = body.notes;
    }
    const prevProcess = await Process.findByIdAndUpdate(id, data).exec();
    const currentState = await States.findById(prevProcess.state);
    const owner = body.owner ?
      body.owner :
      (await Samples.findById(prevProcess.sample)).createdBy;
    const nextState = await States.findOne({order: currentState.order + 1});
    const newOwner = await Users.findById(owner);
    const nextProcess = new Process({
      owner: newOwner._id,
      state: nextState._id,
      sample: prevProcess.sample,
      prevProcess: prevProcess._id,
    });
    await nextProcess.save();
    const info = {email: newOwner.email, subject: 'Nueva muestra'};
    const html = await renderTemplate('new-process', {
      state: nextState.label,
    });
    await sendEmail(html, info);
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};
