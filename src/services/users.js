const Users = require('../models/users');
const Events = require('../models/events');
const Process = require('../models/process');
require('../models/roles');
const {genSalt, hashString} = require('../helpers/bcrypt');
const {inspect} = require('util');
const {defaultError, badRequest} = require('./errors');
const {loginUser} = require('./auth');
const {database} = require('../config');
const ERRORS = require('../helpers/constants');

const canChangeRol = async id => {
  const events = await Events.find({testers: id, endAt: null}).exec();
  const process = await Process.find({owner: id, endAt: null}).exec();
  return {id, canChangeRol: !(events.length > 0 || process.length > 0)};
};

exports.createUser = async ({password, ...params}) => {
  try {
    const salt = genSalt();
    const data = {
      ...params,
      salt,
      hash: hashString(password, salt),
    };
    const user = new Users(data);
    await user.save();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.deleteUser = async ({id}) => {
  try {
    await Users.findByIdAndDelete(id);
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.modifyUser = async ({id}, data) => {
  try {
    await Users.findByIdAndUpdate(id, data);
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.getInfo = async ({id}) => {
  try {
    return Users
        .findById(id, 'document email mobile name')
        .populate({path: 'rol', select: {'_id': 1, 'name': 1}})
        .exec();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.updateInfo = async ({id}, data) => {
  try {
    await Users.findByIdAndUpdate(id, data);
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.updatePassword = async ({email, id}, body) => {
  try {
    if (body.password.trim() === body.confirm.trim()) {
      try {
        await loginUser(
            {email, password: body.current},
            {isApp: !!body.isApp},
        );
        const salt = genSalt();
        const data = {
          salt,
          hash: hashString(body.password, salt),
        };
        await Users.findByIdAndUpdate(id, data);
      } catch (e) {
        if (e.internalCode === ERRORS.UNAUTHORIZED) {
          throw badRequest('Contraseña incorrecta');
        }
        throw e;
      }
    } else {
      throw badRequest('Contraseñas no coinciden');
    }
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.fetchUsers = async ({app = false, hasFilter = false}) => {
  try {
    const filter = hasFilter ? {
      rol: {$in: app ? database.roleApp : database.roles},
    } : {};
    const users = await Users
        .find( filter, 'document email mobile name rol')
        .populate({path: 'rol'})
        .lean()
        .exec();
    const promises = [];
    for (const user of users) {
      promises.push(canChangeRol(user._id));
    }
    const listPromise = await Promise.all(promises);
    return users.map(user => {
      const {canChangeRol} = listPromise.find(l => l.id === user._id);
      return {...user, canChangeRol};
    });
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};
