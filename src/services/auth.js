/* eslint-disable prefer-promise-reject-errors */
const Users = require('../models/users');
require('../models/roles');
const {
  compareString,
  createToken,
  genSalt,
  hashString,
} = require('../helpers/bcrypt');
const {defaultError, unauthorized, badRequest} = require('./errors');
const {inspect} = require('util');
const {signJWT} = require('../middlewares/auth');
const {renderTemplate, sendEmail} = require('../helpers/email');
const {webUrl, database} = require('../config');

exports.loginUser = async ({email, password}, isApp = false) => {
  try {
    const user = await Users
        .findOne({email, rol: {$in: isApp ? database.roleApp : database.roles}})
        .populate({path: 'rol', select: {'_id': 0, 'name': 1}})
        .exec();
    if (!user) throw unauthorized('Correo o contraseña incorrecta');
    const validPassword = compareString(password, user.hash, user.salt);
    if (!validPassword) throw unauthorized('Correo o contraseña incorrecta');
    const token = signJWT(user, isApp);
    return {token, rol: user.rol.name};
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.recoverPsw = async ({email, isApp = false}) => {
  try {
    const user = await Users
        .findOne({email, rol: {$in: isApp ? database.roleApp : database.roles}})
        .exec();
    if (!user) throw unauthorized('Correo no registrado');
    const token = createToken();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    const info = {email: user.email, subject: 'Reestrablecer contraseña'};
    const html = await renderTemplate('psw-recovery', {
      name: user.name,
      url: webUrl+`/reset-password/?token=${token}`,
    });
    await sendEmail(html, info);
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.resetPsw = async ({token, confirm, password}) => {
  try {
    if (password.trim() === confirm.trim()) {
      const salt = genSalt();
      const user = await Users.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: {$gt: Date.now()},
      });
      user.salt = salt;
      user.hash = hashString(password, salt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      const info = {
        email: user.email,
        subject: '¡Éxito! Tu contraseña ha sido cambiada.',
      };
      const html = await renderTemplate(
          'psw-restore',
          {name: user.name, url: webUrl});
      await sendEmail(html, info);
    } else {
      throw badRequest('Contraseñas no coinciden');
    }
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.validTokenPsw = async ({token}) => {
  try {
    const user = await Users.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {$gt: Date.now()},
    });
    if (!user) throw unauthorized();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

