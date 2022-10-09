const bcrypt = require('bcrypt');
const { response } = require('express');
const loginRouter = require('express').Router();
const User = require('../models/user');
const loginHelper = require('../utils/login_helper.js');

loginRouter.post('/whoami', async (request, response) => {
  const user = request.user;
  if (!user) {
    return response.status(401).end();
  }
  const userForToken = {
    username: user.username,
    id: user._id,
  };
  const token = loginHelper.tokenFor(userForToken);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }
  const userForToken = {
    username: user.username,
    id: user._id,
  };
  const token = loginHelper.tokenFor(userForToken);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
