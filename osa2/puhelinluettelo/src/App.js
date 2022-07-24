import { useState, useEffect } from 'react'
import axios from 'axios'

const NameFilter = ({ filter, handler }) => {
  return (
    <div>
    filter numbers: 
    <input value={filter} onChange={handler} />
  </div>
  )
}

const PersonForm = ({ submitHandler, name, nameHandler, number, numberHandler }) => {

  return (
    <form onSubmit={submitHandler}>
        <div>
          name: 
          <input
            value={name}
            onChange={nameHandler}
          />
        </div>
        <div>
          number: 
          <input
            value={number}
            onChange={numberHandler}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const FilteredPersonList = ({ persons, filter }) => {
  const filteredPersons = persons.filter((person) => {
    return (filter === '' || person.name.toLowerCase().includes(filter))
  });
  return (
    <ul>
    {filteredPersons.map(person => 
      <li key={person.name}>{person.name} - {person.number}</li>
    )}
    </ul>
  );
}
const App = () => {
  const [persons, setPersons] = useState([]);
  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const [nameFilter, setNameFilter] = useState('');
  const handleFilterChange = (event) => {
    setNameFilter(event.target.value);
  }

  const [newName, setNewName] = useState('');
  const handleNameChange = (event) => {
    console.log('handleNameChange', event.target.value);
    setNewName(event.target.value);
  }
  const [newNumber, setNewNumber] = useState('');
  const handleNumberChange = (event) => {
    console.log('handleNumberChange', event.target.value);
    setNewNumber(event.target.value);
  }
  const addName = (event) => {
    console.log('addName', event);
    event.preventDefault();
    const names = persons.map((person) => person.name);
    if (names.includes(newName)) {
      alert(`[${newName}] is already known.`);
    } else {
      const newPerson = { 
        name: newName,
        number: newNumber
      };
      setPersons(persons.concat(newPerson));
      setNewName('');
      setNewNumber('');
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <NameFilter filter={nameFilter} handler={handleFilterChange} />
      <h3>add new</h3>
      <PersonForm 
        submitHandler={addName} 
        name={newName}
        nameHandler={handleNameChange}
        number={newNumber}
        numberHandler={handleNumberChange}
        />
      <h2>Numbers</h2>
      <FilteredPersonList persons={persons} filter={nameFilter} />
    </div>
  )

}

export default App