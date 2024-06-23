import { useState, useEffect } from 'react';
import axios from 'axios';

import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    personService.getAll().then(responsePersons => {
      setPersons(responsePersons);
    })
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    if (newName === '' || newNumber === '') {
      return;
    }
    if (persons.find(person => person.name === newName)) {
      alert(`a person named "${newName}" is already added to phonebook`);
      return;
    }
    if (persons.find(person => person.number === newNumber)) {
      alert(`a person with phone number "${newNumber}" is already added to phonebook`);
      return;
    }

    const newPersonObject = {
      name: newName,
      number: newNumber
    }
    personService.create(newPersonObject).then(responsePerson => {
      setPersons(persons.concat(responsePerson));
      setNewName('');
      setNewNumber('');

    })
  }

  const handleNameChange = (event) => {
    if (event.target.value === '') {
      return;
    }
    setNewName(event.target.value);
  }
  const handleNumberChange = (event) => {
    if (event.target.value === '') {
      return;
    }
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  const deletePerson = (id) => {
    if (window.confirm(`Delete ${persons.find(person => person.id === id).name}?`)) {
      personService
        .remove(id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== id));
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterChangeHandler={handleFilterChange} />

      <h3>add a new</h3>
      <PersonForm submitAction={addPerson} nameChangeHandler={handleNameChange} numberChangeHandler={handleNumberChange} />

      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} deleteClick={deletePerson} />
    </div>
  );
}

export default App;