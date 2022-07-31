const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config();

// eslint-disable-next-line no-unused-vars
const postContentToken = morgan.token('postContent', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});
// it is actually used in the token below
const morganTokens = ':method :url :status :res[content-length] - :response-time ms :postContent';

const app = express();

app.use(express.json());
app.use(morgan(morganTokens));
app.use(cors());
app.use(express.static('build'));

const Person = require('./models/person');

app.get('/api/persons', (_request, response, next) => {
  Person.find({}).then(people => {
    response.json(people);
  }).catch(error => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  }).catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    }).catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name and number are required'
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person.save().then(savedPerson => {
    response.json(savedPerson);
  }).catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson);
    }).catch(error => next(error));
});

// comment for commit
app.get('/info', (_request, response, next) => {
  Person.find({}).then(people => {
    const now = new Date();
    response.send(`<p>Phonebook has ${people.length} entries.</p><p>${now}</p>`);
  }).catch(error => next(error));
});

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, _request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});