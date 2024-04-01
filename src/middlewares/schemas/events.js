exports.object = {
  'samples.*': {
    in: ['body'],
    isMongoId: 'Muestras inválidas',
  },
  'testers.*': {
    in: ['body'],
    isMongoId: 'Responsables inválidos',
  },
  'startAt': {
    in: ['body'],
    isISO8601: 'Fecha de inicio incorrecta',
  },
  'notes': {
    in: ['body'],
    optional: {options: {nullable: true}},
    isLength: {
      errorMessage: 'Notas insuficientes',
      options: {min: 1},
    },
  },
  'emails.*': {
    in: ['body'],
    isEmail: true,
    errorMessage: 'Correo inválido',
  },
};

exports.update = {
  sample: {
    in: ['body'],
    isMongoId: true,
    errorMessage: 'Muestra inválida',
  },
  tester: {
    in: ['body'],
    isMongoId: true,
    errorMessage: 'Responsable inválido',
  },
  data: {
    in: ['body'],
    isJSON: true,
    errorMessage: 'Datos incorrectos',
  },
};
