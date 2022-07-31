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

let persons = [
  { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
  },
  { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
  },
  { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
  },
  { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
  }
];


app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people);
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(p => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(p => p.id !== id)
  response.status(204).end();
})

const generateId = () => {
  let newId;
  do {
    newId = Math.floor(Math.random() * 10000); // UUID plz
  } while (persons.find(p => p.id === newId));
  return newId;
}
app.post('/api/persons', (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name and number are required'
    })
  }

  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({
      error: `[${body.name}] already exists. please update instead.`
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  persons = persons.concat(person);
  response.json(person);
})

app.get('/info', (request, response) => {
  const count = persons.length;
  const now = new Date();
  response.send(`<p>Phonebook has ${count} entries.</p><p>${now}</p>`);
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})