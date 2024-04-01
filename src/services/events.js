const {inspect} = require('util');
const Mongoose = require('mongoose');
const Events = require('../models/events');
require('../models/samples');
require('../models/users');
const {defaultError} = require('./errors');
const {renderTemplate, sendEmail} = require('../helpers/email');

exports.getAll = async ({id}, {hasFilter = false}) => {
  try {
    const aggregate = [
      {
        '$lookup': {
          'from': 'users',
          'localField': 'leader',
          'foreignField': '_id',
          'as': 'leader',
        },
      },
      {
        '$unwind': '$leader',
      },
      {
        '$project': {
          'activated': 1,
          'startAt': {
            '$dateToString': {
              'date': '$startAt',
            },
          },
          'endAt': {
            '$dateToString': {
              'date': '$endAt',
            },
          },
          'leader._id': 1,
          'leader.name': 1,
          'samples': {
            '$size': '$samples',
          },
          'testers': {
            '$size': '$testers',
          },
        },
      },
    ];
    if (hasFilter) {
      aggregate.unshift({
        '$match': {
          'testers': {
            '$in': [
              // eslint-disable-next-line new-cap
              Mongoose.Types.ObjectId(id),
            ],
          },
        },
      });
    }
    return Events
        .aggregate(aggregate)
        .exec();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.getOne = async ({id}) => {
  try {
    const {results, ...info} = await Events
        .findById(id)
        .populate({path: 'samples', select: {'code': 1}})
        .populate({path: 'testers', select: {'name': 1, 'email': 1}})
        .populate({path: 'leader', select: {'name': 1, 'email': 1}})
        .lean()
        .exec();
    const list = {};
    if (results) {
      Object.entries(results).forEach(([sample, t]) => {
        list[sample] = {};
        Object.entries(t).forEach(([tester, result]) => {
          list[sample][tester] = [];
          Object.keys(result).forEach(a => list[sample][tester].push(a));
        });
      });
    }
    return {info: {...info, data: results || {}}, results: list};
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.create = async ({emails, notes, startAt, ...rest}) => {
  try {
    const body = {...rest};
    if (notes) {
      body.notes = notes;
    }
    if (startAt) {
      body.startAt = startAt;
    }
    const newEvent = new Events(body);
    await newEvent.save();
    const info = {
      email: emails,
      subject: 'Nuevo evento de cata',
    };
    const html = await renderTemplate('new-event', {
      total: body.samples.length,
    });
    await sendEmail(html, info);
  } catch (e) {
    console.error(inspect(e));
    throw defaultError('Estado o responsable incorrectos');
  }
};

exports.updateOne = async ({id}, body) => {
  try {
    await Events.findByIdAndUpdate(id, body).exec();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.addResult = async ({id}, {category, sample, tester, ...body}) => {
  try {
    if (body.quality) {
      body.quality = parseFloat(body.quality);
    }
    await Events
        .findByIdAndUpdate(
            id,
            {$set: {[`results.${sample}.${tester}.${category}`]: body}},
        )
        .exec();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.addSample = async ({id, sample}) => {
  try {
    console.log(id);
    console.log(sample);
    await Events
        .findByIdAndUpdate(
            id,
            {$push: {'samplesCompleted': sample}},
        )
        .exec();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};
