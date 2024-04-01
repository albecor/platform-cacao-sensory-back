const crypto = require('crypto');

exports.randomHash = async bytes =>
  crypto
      .randomBytes(bytes)
      .toString('hex');

exports.genSalt = () =>
  crypto
      .randomBytes(16)
      .toString('hex');

exports.hashString = (str, salt) =>
  crypto
      .pbkdf2Sync(str, salt, 10, 64, 'sha512')
      .toString('hex');

exports.createToken = () => {
  const buffer = crypto.randomBytes(20);
  return buffer.toString('hex');
};


exports.compareString = (str, compare, salt) => {
  const hash = exports.hashString(str, salt);
  return hash === compare;
};
