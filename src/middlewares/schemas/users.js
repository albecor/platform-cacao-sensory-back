exports.modifyInfo = {
  email: {
    in: ['body'],
    isEmail: true,
    errorMessage: 'Correo inválido',
  },
  name: {
    in: ['body'],
    isString: true,
    isLength: {
      errorMessage: 'El nombre debe tener mínimo 4 letras',
      options: {min: 4},
    },
    errorMessage: 'Nombre inválido',
  },
  mobile: {
    in: ['body'],
    isMobilePhone: {
      options: ['es-CO'],
    },
    errorMessage: 'Teléfono inválido',
  },
  document: {
    in: ['body'],
    isNumeric: {
      errorMessage: 'Documento inválido, sólo números',
    },
    toInt: true,
    isLength: {
      errorMessage: 'El documento debe tener mínimo 7 números y máximo 11',
      options: {max: 11, min: 7},
    },
  },
};
exports.register = {
  ...exports.modifyInfo,
  password: {
    in: ['body'],
    isStrongPassword: true,
    errorMessage: 'Contraseña inválida',
  },
};
exports.updatePassword = {
  current: {
    in: ['body'],
    isStrongPassword: true,
    errorMessage: 'Contraseña inválida',
  },
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
exports.findUsers = {
  hasFilter: {
    in: ['query'],
    optional: {options: {nullable: true}},
    isBoolean: true,
    toBoolean: true,
    errorMessage: 'Filtro inválido',
  },
  app: {
    in: ['query'],
    optional: {options: {nullable: true}},
    isBoolean: true,
    toBoolean: true,
    errorMessage: 'Filtro inválido',
  },
};
