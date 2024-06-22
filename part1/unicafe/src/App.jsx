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
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)
  // Event handlers
  const handleGood = () => {
    const updateGood = good+1
    const updateAll = updateGood+neutral+bad
    setGood(updateGood)
    setAll(updateAll)
    setAverage((updateGood-bad)/updateAll)
    setPositive(updateGood/updateAll*100)
  }
  const handleNeutral = () => {
    const updateNeutral = neutral+1
    const updateAll = good+updateNeutral+bad
    setNeutral(updateNeutral)
    setAll(updateAll)
    setAverage((good-bad)/updateAll)
    setPositive(good/updateAll*100)
  }
  const handleBad = () => {
    const updateBad = bad+1
    const updateAll = good+neutral+updateBad
    setBad(updateBad)
    setAll(updateAll)
    setAverage((good-updateBad)/updateAll)
    setPositive(good/updateAll*100)
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
        {
        all>0?
        <>
          <Statistic text='good' value={good}/>
          <Statistic text='neutral' value={neutral}/>
          <Statistic text='bad' value={bad}/>
          <Statistic text='all' value={all}/>
          <Statistic text='average' value={average}/>
          <Statistic text='positive' value={positive+' %'}/>
        </>
        :
        'No feedback given'
        }
        </p>
    </div>
  )
}

export default App