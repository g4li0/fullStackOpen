const Header = ({course}) => {
    return (
      <h2>{course.name}</h2>
    )
  }
  const Part = ({part}) => {
    return(
      <p>
        {part.name} {part.exercises}
      </p>
    )
  }
  
  const Content = ({course}) => {
    return (
      <div>
        {course.parts.map(part => <Part key={part.id} part={part} />)}
      </div>
    )
  }
  
  const Total = ({course}) => {
    //use map to transform course's array of part objects into an array of numbers, then with reduce we sum all the numbers
    return (
      <p>
        <strong>total of {course.parts.map(part => part.exercises).reduce((a, b) => a + b, 0)} exercises</strong>
      </p>
    )
  }
  
  const Course = ({course}) => {
    return (
      <div>
        <Header course={course} />
        <Content course={course}/>
        <Total course={course} />
      </div>
    )
  }

export default Course