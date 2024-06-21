import { useState } from 'react'

// Button component
const Button = ({clickHandler,text}) => {
  return (
    <button onClick={clickHandler}>{text}</button>
  )
}
// Statistic component
const Statistic = ({text,value}) => {
  return (
    <>{text} {value}<br/></>
  )
}
// App component
const App = () => {
  // State variables
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  // Event handlers
  const handleGood = () => {
    setGood(good+1)
  }
  const handleNeutral = () => {
    setNeutral(neutral+1)
  }
  const handleBad = () => {
    setBad(bad+1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <p>
        <Button clickHandler={handleGood} text='good'/>
        <Button clickHandler={handleNeutral} text='neutral'/>
        <Button clickHandler={handleBad} text='bad'/>
      </p>
      <h1>statistic</h1>
      <p>
        <Statistic text='good' value={good}/>
        <Statistic text='neutral' value={neutral}/>
        <Statistic text='bad' value={bad}/>
      </p>
    </div>
  )
}

export default App