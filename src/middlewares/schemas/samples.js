/* eslint-disable prefer-promise-reject-errors */
const {getById} = require('../../services/states');
const {isMongoId} = require('validator');
exports.object = {
  'sample.code': {
    in: ['body'],
    isAlphanumeric: {
      options: ['es-ES'],
      errorMessage: 'Código inválido',
    },
    isLength: {
      errorMessage: 'El código debe tener mínimo 3 número',
      options: {min: 3},
    },
  },
  'sample.producer': {
    in: ['body'],
    isMongoId: {
      errorMessage: 'Productor incorrecto',
    },
  },
  'sample.farm': {
    in: ['body'],
    optional: {options: {nullable: true}},
    isMongoId: {
      errorMessage: 'Finca/Vereda incorrecta',
    },
  },
  'sample.variety': {
    in: ['body'],
    optional: {options: {nullable: true}},
    isString: true,
    isAlpha: {
      options: ['es-ES'],
      errorMessage: 'Variedad inválida',
    },
    isLength: {
      errorMessage: 'La variedad debe tener mínimo 4 letras',
      options: {min: 3},
    },
  },
  'sample.altitude': {
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
  'process.state': {
    in: ['body'],
    custom: {
      options: value => {
        return getById(value).then(state => {
          if (!state) {
            return Promise.reject('Estado incorrecto');
          }
        }).catch(() => Promise.reject('Estado incorrecto'));
      },
    },
  },
  'process.owner': {
    in: ['body'],
    custom: {
      options: (value, {req}) => {
        return getById(req.body.process.state).then(state => {
          if (state.order < 6 && !isMongoId(value)) {
            return Promise.reject('Responsable inválido');
          } else {
            return true;
          }
        }).catch(() => Promise.reject('Estado incorrecto'));
      },
    },
  },
  'process.data': {
    in: ['body'],
    optional: {options: {nullable: true}},
    isJSON: true,
    errorMessage: 'Datos incorrectos',
  },
};

exports.update = {
  code: {
    in: ['body'],
    optional: {options: {nullable: true}},
    isAlphanumeric: {
      options: ['es-ES'],
      errorMessage: 'Código inválido',
    },
    isLength: {
      errorMessage: 'El código debe tener mínimo 3 número',
      options: {min: 3},
    },
  },
  producer: {
    in: ['body'],
    optional: {options: {nullable: true}},
    isMongoId: {
      errorMessage: 'Productor incorrecto',
    },
  },
  farm: {
    in: ['body'],
    optional: {options: {nullable: true}},
    isMongoId: {
      errorMessage: 'Finca/Vereda incorrecta',
    },
  },
  variety: {
    in: ['body'],
    optional: {options: {nullable: true}},
    isString: true,
    isAlpha: {
      options: ['es-ES'],
      errorMessage: 'Variedad inválida',
    },
    isLength: {
      errorMessage: 'La variedad debe tener mínimo 4 letras',
      options: {min: 3},
    },
  },
  altitude: {
    in: ['body'],
    optional: {options: {nullable: true}},
    isNumeric: {
      errorMessage: 'Altitud inválida',
    },
    toInt: true,
    isLength: {
      errorMessage: 'La altitud debe tener mínimo 1 número',
      options: {min: 1},
    },
  },
};

exports.getReady = {
  owner: {
    in: ['query'],
    optional: {options: {nullable: true}},
    isMongoId: true,
    errorMessage: 'Parámetro incorrecto',
  },
};
