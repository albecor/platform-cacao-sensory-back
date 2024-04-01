const Producers = require('../models/producers');
const Farms = require('../models/farms');
const Samples = require('../models/samples');
const {inspect} = require('util');
const {defaultError} = require('./errors');

exports.getAll = async () => {
  try {
    return Producers.find({}, 'document phone name').exec();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.getOne = async ({id}) => {
  try {
    const producer = await Producers.findById(id).lean().exec();
    if (producer.document) {
      producer.document = String(producer.document);
    }
    if (producer.phone) {
      producer.phone = String(producer.phone);
    }
    producer.samples = await Samples
        .find({producer: producer._id})
        .exec();
    producer.farms = await Farms
        .find({producer: producer._id})
        .exec();
    return producer;
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.create = async data => {
  try {
    const newProducer = new Producers({
      name: data.name,
      email: data.email,
      document: data.document,
      phone: data.phone,
    });
    await newProducer.save();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.edit = async ({id}, data) => {
  try {
    await Producers.findByIdAndUpdate(id, data).exec();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.deleteOne = async ({id}) => {
  try {
    await Producers.findByIdAndDelete(id).exec();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};
