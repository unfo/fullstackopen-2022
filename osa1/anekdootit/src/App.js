import { useState } from 'react'

const AnecdoteOfTheDay = ({ anecdotes, votes, current }) => {
  return (
    <>
    <h1>Anecdote of the day</h1>
    <div>
    <AnecdoteWithVotes text={anecdotes[current]} votes={votes[current]} />
    </div>
    </>
  )

}
const AnecdoteWithVotes = ({text, votes}) => {
  return (
    <>
    <p>{text}</p>
    <p><pre>has {votes} votes</pre></p>
    </>
  )
}
const MostVoted = ({ anecdotes, votes }) => {
  let mostVotes = 0;
  let winner = -1;
  for (const [anecdote, voteCount] of votes.entries()) { 
    if (voteCount > mostVotes) {
      winner = anecdote;
      mostVotes = voteCount;
    }
  }
  if (mostVotes === 0) {
    return (
      <p>Vote for your favorite!</p>
      )
  } else {
    let text = anecdotes[winner];
    return (
      <>
      <h1>Anecdote with the most votes</h1>
      <AnecdoteWithVotes text={text} votes={mostVotes} />
      </>
      )
  }
}
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
  
  const [selected, setSelected] = useState(0)
  
  const startingVotes = Array(anecdotes.length).fill(0);
  const [votes, setVotes] = useState(startingVotes);
  
  const randomAnecdote = () => {
    console.log('Random wisdom');
    const total = anecdotes.length;
    let nextAnecdote = selected;
    do {
      nextAnecdote = Math.floor(Math.random() * total);
    } while (nextAnecdote === selected); // make sure it actually changes
    setSelected(nextAnecdote);
  }
  
  const vote = () => {
    const newVotes = [...votes];
    newVotes[selected] += 1;
    setVotes(newVotes);
  }
  return (
    <>
    <AnecdoteOfTheDay anecdotes={anecdotes} votes={votes} current={selected} />
    <button onClick={vote}>vote</button>
    <button onClick={randomAnecdote}>next anecdote</button>
    <MostVoted anecdotes={anecdotes} votes={votes} />
    </>
    )
}

export default App