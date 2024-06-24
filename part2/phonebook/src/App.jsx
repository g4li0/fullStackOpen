import { useState, useEffect } from 'react';
//import axios from 'axios';

import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import Notification from './components/Notification';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notificationMessage, setNotificationMessage] = useState({message:null,type:null});

  useEffect(() => {
    personService.getAll().then(responsePersons => {
      setPersons(responsePersons);
    })
  }, []);

  const notificationTimeOut = () => {
    setTimeout(() => {
      setNotificationMessage({message:null,type:null});
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault();
    if (newName === '' || newNumber === '') {
      return;
    }
    const ocurrence = persons.find(person => person.name === newName);
    if (ocurrence !== undefined) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        personService.update(ocurrence.id, {...ocurrence, number: newNumber}).then(responsePerson => {
          setPersons(persons.map(person => person.id !== responsePerson.id ? person : responsePerson));
          setNotificationMessage({
            message: `Updated ${responsePerson.name}'s number`,
            type: 'success'
          });
          notificationTimeOut();
        })
      }
        return;
    }
    if (persons.find(person => person.number === newNumber)) {
      setNotificationMessage({
        message: `a person with phone number "${newNumber}" is already added to phonebook`,
        type: 'error'
      });
      notificationTimeOut();
      return;
    }

    const newPersonObject = {
      name: newName,
      number: newNumber
    }
    personService.create(newPersonObject).then(responsePerson => {
      setPersons(persons.concat(responsePerson));
      setNotificationMessage({
        message: `Added ${responsePerson.name}`,
        type: 'success'
      });
      notificationTimeOut();
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
      <Notification message={notificationMessage.message} type={notificationMessage.type} />
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