const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const blogRouter = require('./controllers/blogs');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

// Setup
app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

// App logic
app.use('/api/blogs', blogRouter);

// Error handling
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;