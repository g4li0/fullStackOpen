import { useState } from 'react'

// Button component
const Button = ({clickHandler,text}) => {
  return (
    <button onClick={clickHandler}>{text}</button>
  )
}
// Statistics component
const Statistics = (props) => {
  
  if(props[3].value===0){
    return (
      <p>No feedback given</p>
    )
  }
  
  return (
    <table>
      <tbody>
        <StatisticLine text={props[0].text} value={props[0].value}/>
        <StatisticLine text={props[1].text} value={props[1].value}/>
        <StatisticLine text={props[2].text} value={props[2].value}/>
        <StatisticLine text={props[3].text} value={props[3].value}/>
        <StatisticLine text={props[4].text} value={props[4].value}/>
        <StatisticLine text={props[5].text} value={props[5].value}/>
        </tbody>
    </table>
  )
}
// StatisticLLine component
const StatisticLine = ({text,value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
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

  const statistics = [
    {text:'good',value:good},
    {text:'neutral',value:neutral},
    {text:'bad',value:bad},
    {text:'all',value:all},
    {text:'average',value:average},
    {text:'positive',value:positive+' %'}
  ]

  return (
    <div>
      <h1>give feedback</h1>
      <p>
        <Button clickHandler={handleGood} text='good'/>
        <Button clickHandler={handleNeutral} text='neutral'/>
        <Button clickHandler={handleBad} text='bad'/>
      </p>
      <h1>statistic</h1>
      <Statistics {...statistics}/>
    </div>
  )
}

export default App