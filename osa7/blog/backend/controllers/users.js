const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');
const logger = require('../utils/logger');

usersRouter.get('/', async (_, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
  });
  response.json(users);
});

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body;
  const knownUser = await User.findOne({ username });
  let error;
  if (knownUser) {
    error = {
      name: 'ValidationError',
      param: 'username',
      message: 'username must be unique',
      value: username,
    };
    // send to centralized middleware error handling
    return next(error);
  }
  if (password.length <= 3) {
    error = {
      name: 'ValidationError',
      param: 'password',
      message: 'password minimum length is 3',
      // value: password
    };
    if (error) {
      logger.error('We have an error', error);
      // send to centralized middleware error handling
      return next(error);
    }
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
