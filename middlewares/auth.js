const jwt = require('jsonwebtoken');

const NotAuthError = require('../errors/NotAuthError');
const BadRequestError = require('../errors/BadRequestError');

const {
  NOT_AUTH_ERROR,
  BAD_REQUEST,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
   const { authorization } = req.headers;
   if (!authorization || !authorization.startsWith('Bearer ')) {
     throw new BadRequestError(BAD_REQUEST);
   }

   const token = authorization.replace('Bearer ', '');
//const token = 'qwJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDJlMGI0MGFkZTJlMDFkN2VjND.kNTciLCJpYXQiOjEwBTM2MzAzjjEsImV4cCI1MTYxNDIzNTEyMX0.ciMALhlsVPuG0SwzY7isi390LjlBNNZ_9bOizCq8HTs';
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new NotAuthError(NOT_AUTH_ERROR);
  }

  req.user = payload;

  next();
};
