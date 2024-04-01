exports.object = {
  farm: {
    in: ['body'],
    optional: {options: {nullable: true}},
    isString: true,
    isLength: {
      errorMessage: 'La finca/vereda debe tener mínimo 4 letras',
      options: {min: 4},
    },
    errorMessage: 'Nombre inválido',
  },
  state: {
    in: ['body'],
    optional: {options: {nullable: true}},
    isNumeric: true,
    errorMessage: 'Departamento inválido',
  },
  city: {
    in: ['body'],
    optional: {options: {nullable: true}},
    isNumeric: true,
    errorMessage: 'Ciudad inválida',
  },
  altitude: {
    in: ['body'],
    optional: {options: {nullable: true}},
    isNumeric: {
      errorMessage: 'Altitud inválida, sólo números',
    },
    toInt: true,
    isLength: {
      errorMessage: 'La altitud debe tener mínimo 1 número',
      options: {min: 1},
    },
  },
};
