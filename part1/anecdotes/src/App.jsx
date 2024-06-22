import { useState } from 'react'

const Button = ({clickHandler,text}) => {
  return (
    <button onClick={clickHandler}>{text}</button>
  )
}

const Anecdote = ({anecdote,votes}) => {
  return (
    <div>
      {anecdote}<br/>
      has {votes} votes
    </div>
  )
}

const Section = ({title,anecdotes,votes,index}) => {
  //console.log(anecdotes[index])
  return(
    <>
      <h1>{title}</h1>
      <Anecdote anecdote={anecdotes[index]} votes={votes[index]} />
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length))
  
  const randomIndex = () => Math.floor(Math.random() * anecdotes.length)

  const nextAnecdoteClick = () => {
    let nextIndex = randomIndex()
    while(nextIndex === selected) {
      nextIndex = randomIndex()   
    }
    setSelected(nextIndex)
  }
  const voteClick = () => {
    const copy = [...votes]
    copy[selected] += 1
    //console.log(copy)
    setVotes(copy)
  } 

  const mostVotedIndex = (votes) => {
    let max = 0
    let mostVoted = 0
    for (let i = 0; i < votes.length; i++) {
      if (votes[i] > max) {
        max = votes[i]
        mostVoted = i
      }
    }
    return mostVoted
  }

  return (
    <div>
      <Section title={'Anecdote of the day'} anecdotes={anecdotes} votes={votes} index={selected} />
      <Button clickHandler={voteClick} text='vote' />
      <Button clickHandler={nextAnecdoteClick} text='next anecdote' />
      <Section title={'Anecdote with most votes'} anecdotes={anecdotes} votes={votes} index={mostVotedIndex(votes)} />
    </div>
  )
}

export default App