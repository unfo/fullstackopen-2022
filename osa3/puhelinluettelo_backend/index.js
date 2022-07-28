const { response } = require('express');
const express = require('express');
const app = express();

const morgan = require('morgan');

app.use(express.json());
app.use(morgan('tiny'));

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

app.get('/', (request, response) => {
  response.send('<h1>Hello, World!</h1>');
})

app.get('/api/persons', (request, response) => {
  response.json(persons);
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

const PORT = 3001
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})