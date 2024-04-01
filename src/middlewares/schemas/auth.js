exports.login = {
  email: {
    in: ['body'],
    isEmail: true,
    errorMessage: 'Correo inválido',
  },
  password: {
    in: ['body'],
    isStrongPassword: true,
    errorMessage: 'Contraseña inválida',
  },
};
exports.recoverPassword = {
  email: {
    in: ['body'],
    isEmail: true,
    errorMessage: 'Correo inválido',
  },
};
exports.tokenPsw = {
  token: {
    in: ['params'],
    isLength: {
      errorMessage: 'Token inválido',
      options: {min: 40, max: 40},
    },
    isAlphanumeric: true,
    errorMessage: 'Token inválido',
  },
};
exports.resetPsw = {
  ...exports.tokenPsw,
  password: {
    in: ['body'],
    isStrongPassword: true,
    errorMessage: 'Contraseña inválida',
  },
  confirm: {
    in: ['body'],
    isStrongPassword: true,
    errorMessage: 'Contraseña inválida',
  },
};
