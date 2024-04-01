const {inspect} = require('util');
const {defaultError} = require('./errors');
const Email = require('email-templates');
const nodemailer = require('nodemailer');
const {emailConfig} = require('../config');
const {APP_NAME} = require('./constants');

exports.renderTemplate = async (layout, content) => {
  try {
    const template = new Email({
      views: {
        options: {
          extension: 'ejs',
        },
      },
    });
    return template.render(layout, content);
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.sendEmail = (html, data) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport(emailConfig);
    transporter.sendMail({
      from: APP_NAME,
      to: data.email,
      html: html,
      subject: data.subject,
    }, function(err, responseStatus) {
      if (err) return reject(err);
      return resolve(responseStatus);
    });
  });
};
