import { useState } from 'react'

const Statistics = ({good, neutral, bad}) => {
  let total = good + neutral + bad;
  let avg = (total > 0) ? (good + (-1 * bad)) / total : 0;
  let positive = (total > 0) ? 100 * (good / total) : 0;

  return (
    <>
      <h1>statistics</h1>
      <p>Good {good}</p>
      <p>Neutral {neutral}</p>
      <p>Bad {bad}</p>
      <p>All {total}</p>
      <p>Avg {avg}</p>
      <p>Positive {positive} %</p>
    </>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // const options = 
  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App