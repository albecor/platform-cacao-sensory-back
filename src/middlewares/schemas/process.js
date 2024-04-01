/* eslint-disable prefer-promise-reject-errors */

const {getById} = require('../../services/states');

exports.object = {
  state: {
    in: ['body'],
    custom: {
      options: value => {
        return getById(value).then(state => {
          if (!state) {
            return Promise.reject('Estado incorrecto');
          }
        }).catch(err => Promise.reject('Estado incorrecto'));
      },
    },
  },
  sample: {
    in: ['body'],
    isMongoId: true,
    errorMessage: 'Muestra inválida',
  },
  owner: {
    in: ['body'],
    isMongoId: true,
    errorMessage: 'Responsable inválido',
  },
  data: {
    in: ['body'],
    optional: {options: {nullable: true}},
    isJSON: true,
    errorMessage: 'Datos incorrectos',
  },
  notes: {
    in: ['body'],
    isAlphanumeric: {
      options: ['es-ES'],
      errorMessage: 'Notas inválida, sólo números y letras',
    },
    isLength: {
      errorMessage: 'Notas insuficientes',
      options: {min: 1},
    },
    optional: {options: {nullable: true}},
  },
};

exports.update = {
  owner: {
    in: ['body'],
    isMongoId: {
      errorMessage: 'Responsable inválido',
    },
    optional: {options: {nullable: true}},
  },
  notes: {
    in: ['body'],
    isLength: {
      errorMessage: 'Notas insuficientes',
      options: {min: 1},
    },
    optional: {options: {nullable: true}},
  },
};
