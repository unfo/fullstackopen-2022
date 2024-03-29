const logger = require('./logger');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const requestLogger = (request, _, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const tokenExtractor = (request, _, next) => {
  const authHeader = request.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    request.token = authHeader.slice(7);
  }
  next();
};

const userExtractor = async (request, response, next) => {
  if (request.token) {
    const token = jwt.verify(request.token, process.env.SECRET, { algorithms: ['HS256'] });
    const user = await User.findById(token.id);
    if (!user) {
      return response.status(401).json({ error: 'invalid user id' });
    }
    request.user = user;
  }
  next();
};

const unknownEndpoint = (_, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, _, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    });
  }


  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
};