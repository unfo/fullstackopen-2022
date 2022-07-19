import { useState } from 'react'

const StatisticLine = ({text, value}) => {
  return (
    <tr><th>{text}</th><td>{value}</td></tr>
  )
}
const Statistics = ({good, neutral, bad}) => {
  let total = good + neutral + bad;
  let avg = (total > 0) ? (good + (-1 * bad)) / total : 0;
  let positive = (total > 0) ? 100 * (good / total) : 0;
  
  if (total === 0) {
    return (<p>No feedback given</p>)
  } else {
    return (
      <>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="Good" value={good} />
          <StatisticLine text="Neutral" value={neutral} />
          <StatisticLine text="Bad" value={bad} />
          <StatisticLine text="All" value={total} />
          <StatisticLine text="Avg" value={avg} />
          <StatisticLine text="Positive" value={positive + "%"} />
        </tbody>
      </table>
      </>
      )
    }
  }

  const Button = ({handleClick, text}) => {
    return (
      <button onClick={handleClick}>{text}</button>
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
      <Button text="good"     handleClick={() => setGood(good + 1)}  />
      <Button text="neutral"  handleClick={() => setNeutral(neutral + 1)}/>
      <Button text="bad"      handleClick={() => setBad(bad + 1)}  />
      <Statistics good={good} neutral={neutral} bad={bad} />
      </div>
      )
    }
    
    export default App