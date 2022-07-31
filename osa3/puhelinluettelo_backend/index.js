const { response, request } = require('express');
const express = require('express');
const cors = require('cors')
const morgan = require('morgan');

require('dotenv').config();

const postContentToken = morgan.token('postContent', (req, res) => {
  return req.method == 'POST' ? JSON.stringify(req.body) : "";
})

const morganTokens = ':method :url :status :res[content-length] - :response-time ms :postContent';

const app = express();

app.use(express.json());
app.use(morgan(morganTokens));
app.use(cors())
app.use(express.static('build'))

const Person = require('./models/person');

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(people => {
    response.json(people);
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end();
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name and number are required'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person.save().then(savedPerson => {
    response.json(savedPerson);
  }).catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.find({}).then(people => {
    const now = new Date();
    response.send(`<p>Phonebook has ${people.length} entries.</p><p>${now}</p>`);
  }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})