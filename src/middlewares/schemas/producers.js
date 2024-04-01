exports.object = {
  name: {
    in: ['body'],
    isString: true,
    isLength: {
      errorMessage: 'El nombre debe tener mínimo 4 letras',
      options: {min: 4},
    },
    errorMessage: 'Nombre inválido',
  },
  document: {
    in: ['body'],
    optional: {options: {nullable: true}},
    isNumeric: {
      errorMessage: 'Documento inválido, sólo números',
    },
    toInt: true,
    isLength: {
      errorMessage: 'El documento debe tener mínimo 7 números y máximo 11',
      options: {max: 11, min: 7},
    },
  },
  email: {
    in: ['body'],
    optional: {options: {nullable: true}},
    isEmail: {
      errorMessage: 'Correo inválido',
    },
  },
  phone: {
    in: ['body'],
    optional: {options: {nullable: true}},
    isMobilePhone: {
      options: ['es-CO'],
    },
    errorMessage: 'Teléfono inválido',
  },
};
