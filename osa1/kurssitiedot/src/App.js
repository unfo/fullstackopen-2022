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
    return <Part key={"part-"+index} name={item.name} exercises={item.exercises} />
  })
  return (<>{courses}</>)
}

const Total = (props) => {

  const sum = props.contents.reduce((a,b) => a + b.exercises, 0);
  return (
    <div>
      <p>Number of exercises {sum}</p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }
  const contents = [
    part1, part2, part3
  ];
  return (
    <div>
      <Header course={course} />
      <Content contents={contents} />
      <Total contents={contents} />
    </div>
  )
}

export default App