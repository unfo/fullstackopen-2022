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
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]
  return (
    <div>
      <Header course={course} />
      <Content contents={parts} />
      <Total contents={parts} />
    </div>
  )
}

export default App