const Person = ({person,deleteClick}) => <div>{person.name} {person.number} <button onClick={deleteClick}>delete</button></div>;

const Persons = ({persons, filter, deleteClick}) => filter===''?
  persons.map(person => 
    <Person key={person.id} person={person} deleteClick={()=>deleteClick(person.id)} />):
  persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())).map(person => 
    <Person key={person.id} person={person} deleteClick={()=>deleteClick(person.id)} />);

export default Persons;