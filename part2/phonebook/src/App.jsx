import { useState } from 'react'


const Person = ({person}) =>{
  return (
    <div>{person.name}</div>
  )

}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]);

  const [newName, setNewName] = useState('');

  const addName = (event) => {
    event.preventDefault();
    if(newName === ''){
      return;
    }
    if(persons.find(person => person.name === newName)){
      alert(`${newName} is already added to phonebook`);
      return;
    }
    const nameObject = {
      name: newName
    }
    setPersons(persons.concat(nameObject));
    setNewName('');
  }

  const handleNameChange = (event) => {
    if(event.target.value === ''){
      return;
    }
    setNewName(event.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input onChange={handleNameChange} />
        </div>
        
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {/* <div>debug: {newName}</div> */}
      {persons.map(person =>
        <Person key={person.name} person={person} />
      )}
    </div>
  )
}

export default App