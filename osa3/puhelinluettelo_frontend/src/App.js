import { useState, useEffect } from 'react';
import personService from './services/persons';
import Notification from './components/Notification';

const NameFilter = ({ filter, handler }) => {
  return (
    <div>
    filter numbers:
      <input value={filter} onChange={handler} />
    </div>
  );
};

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
  );
};

const FilteredPersonList = ({ persons, filter, deleteHook }) => {
  const filteredPersons = persons.filter((person) => {
    return (filter === '' || person.name.toLowerCase().includes(filter));
  });
  return (
    <ul>
      {filteredPersons.map(person =>
        <li key={person.name}>
          {person.name} - {person.number}
          <button onClick={() => deleteHook(person.id)}>delete</button>
        </li>
      )}
    </ul>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  useEffect(() => {
    personService
      .getAll()
      .then(persons => setPersons(persons));
  }, []);

  const [nameFilter, setNameFilter] = useState('');
  const handleFilterChange = (event) => {
    setNameFilter(event.target.value);
  };

  const [newName, setNewName] = useState('');
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const [newNumber, setNewNumber] = useState('');
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  const addName = (event) => {
    console.log('addName', event);
    event.preventDefault();
    const existingPerson = persons.find(person => person.name === newName);
    if (existingPerson !== undefined) {
      if (window.confirm(`[${existingPerson.name}] already found. Update number?`)) {
        personService.update(existingPerson.id, { ...existingPerson, number: newNumber })
          .then(savedPerson => {
            setPersons(persons.map(person => {
              return person.id === existingPerson.id
                ? savedPerson
                : person;
            }));
            showNotification(`[${savedPerson.name}] successfully updated`, 'success');
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            showNotification(`Failed to update [${existingPerson.name}]. ${error.response.data.error}`, 'fail');
          });
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      };
      personService.create(newPerson)
        .then(savedPerson => {
          console.log('Saved> ', savedPerson);
          showNotification(`[${savedPerson.name}] successfully saved`, 'success');
          setPersons(persons.concat(savedPerson));
          setNewName('');
          setNewNumber('');
        }).catch(error => {
          // console.log(error);
          showNotification(error.response.data.error, 'fail');
        });
    }
  };

  const handleDeletePerson = (id) => {
    const person = persons.find(person => person.id === id);
    console.log('Remove person> ', person);
    if (window.confirm(`Excommunicate ${person.name} effective immediately?`)) {
      personService.remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id));
          showNotification(`[${person.name}] successfully removed`, 'success');
        }).catch(error => {
          // window.alert(`Unable to remove ${person}`);
          console.log(error);
          showNotification(`[${person.name}] failed to leave. ${error.response.data.error}`, 'fail');
        });
    }
  };
  const emptyNotification = {
    message: null,
    messageType: null
  };
  const [notification, setNotification] = useState(emptyNotification);


  const showNotification = (message, type) => {
    console.log('showNotification: ', message, type);
    const timeoutLengths = {
      'success': 5000,
      'fail': 15000
    };
    setNotification({
      message: message,
      messageType: type
    });
    setTimeout(() => {
      setNotification(emptyNotification);
    }, timeoutLengths[type]);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} messageType={notification.messageType} />
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
      <FilteredPersonList persons={persons} filter={nameFilter} deleteHook={handleDeletePerson} />
    </div>
  );

};

export default App;