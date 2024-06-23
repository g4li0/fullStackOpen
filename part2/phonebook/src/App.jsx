import { useState } from 'react'


const Person = ({person}) =>{
  return (
    <div>{person.name} {person.number}</div>
  )

}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  const addPerson = (event) => {
    event.preventDefault();
    if(newName === '' || newNumber === ''){
      return;
    }
    if(persons.find(person => person.name === newName)){
      alert(`${newName} is already added to phonebook`);
      return;
    }
    if(persons.find(person => person.number === newNumber)){
      alert(`${newNumber} is already added to phonebook`);
      return;
    }
    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }
    setPersons(persons.concat(nameObject));
    setNewName('');
    setNewNumber('');
  }

  const handleNameChange = (event) => {
    if(event.target.value === ''){
      return;
    }
    setNewName(event.target.value);
  }
  const handleNumberChange = (event) => {
    if(event.target.value === ''){
      return;
    }
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input onChange={handleFilterChange} />
        {/*console.log('filter', filter)*/}
      </div>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input onChange={handleNameChange} />
        </div>
        <div>
          number: <input onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {/* <div>debug: {newName}</div> */}
      {
        filter===''? 
          
          persons.map(person => 
            <Person key={person.id} person={person} />) :
          
          persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())).map(person => 
            <Person key={person.id} person={person} />)
      }
    </div>
  )
}

export default App