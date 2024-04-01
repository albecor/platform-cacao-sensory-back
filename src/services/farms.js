const Farms = require('../models/farms');
const {inspect} = require('util');
const {defaultError} = require('./errors');

exports.getAll = async () => {
  try {
    return Farms.find({}).exec();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};


exports.create = async data => {
  try {
    const farm = {
      name: data.farm,
      state: data.state,
      city: data.city,
      altitude: data.altitude,
    };
    if (Object.values(farm)) {
      const newFarm = new Farms({...farm, producer: data.producer});
      const snapshot = await newFarm.save();
      return snapshot._id;
    }
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.edit = async ({id}, data) => {
  try {
    await Farms.findByIdAndUpdate(id, data).exec();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.deleteOne = async ({id}) => {
  try {
    await Farms.findByIdAndDelete(id).exec();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};
