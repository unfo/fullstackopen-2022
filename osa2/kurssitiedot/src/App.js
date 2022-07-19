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
  const courses = props.contents.map((item)=>{
    return <Part key={item.id} name={item.name} exercises={item.exercises} />
  })
  return (<>{courses}</>)
}

const Total = ({contents}) => {

  const sum = contents.reduce((a,b) => a + b.exercises, 0);
  return (
    <div>
      <p><strong>Total of {sum} exercises</strong></p>
    </div>
  )
}

const Course = ({course}) => {
  return (
    <>
    <Header course={course.name} />
    <Content contents={course.parts} />
    </>
  )

}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  }
  return (
    <div>
      <Course course={course} />
      <Total contents={course.parts} />
    </div>
  )
}

export default App