import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [nameFilter, setNameFilter] = useState('');
  const handleFilterChange = (event) => {
    setNameFilter(event.target.value);
  }
  const filteredPersons = persons.filter((person) => {
    return (nameFilter === '' || person.name.toLowerCase().includes(nameFilter))
  });
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
      <div>
        filter numbers: 
        <input value={nameFilter} onChange={handleFilterChange} />
      </div>
      <h3>add new</h3>
      <form onSubmit={addName}>
        <div>
          name: 
          <input
            value={newName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          number: 
          <input
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {filteredPersons.map(person => 
          <li key={person.name}>{person.name} - {person.number}</li>
        )}
      </ul>
    </div>
  )

}

export default App