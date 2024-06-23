const Person = ({person}) => <div>{person.name} {person.number}</div>;

const Persons = ({persons, filter}) => filter===''?
  persons.map(person => 
    <Person key={person.id} person={person} />):
  persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())).map(person => 
    <Person key={person.id} person={person} />);

export default Persons;