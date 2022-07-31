require('dotenv').config();

const mongoose = require('mongoose');
const url = process.env.MONGODB_URI;
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const addPerson = process.argv.length === 4;

if (addPerson) {
  const newPerson = new Person({
    name: process.argv[2],
    number: process.argv[3]
  });

  newPerson.save().then(result => {
    console.log(`added [${result.name}] number [${result.number}] to phonebook`);
    mongoose.connection.close()
  });
} else {
  Person.find({}).then(result => {
    result.forEach(person => {
        console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}