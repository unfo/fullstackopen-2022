const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Part = (props) => {
  return (
    <p>{props.name} {props.exercises}</p>
  )
}

const Content = (props) => {
  const courses = props.contents.map((item, index)=>{
    return <Part key={"part-"+index} name={item[0]} exercises={item[1]} />
  })
  return (<>{courses}</>)
}

const Total = (props) => {
  const sum = props.execercises.reduce((a,b) => a+b, 0);
  return (
    <div>
      <p>Number of exercises {sum}</p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14
  const contents = [
    [part1, exercises1],
    [part2, exercises2],
    [part3, exercises3]
  ];
  const exercises = [exercises1, exercises2, exercises3];
  return (
    <div>
      <Header course={course} />
      <Content contents={contents} />
      <Total execercises={exercises} />
    </div>
  )
}

export default App