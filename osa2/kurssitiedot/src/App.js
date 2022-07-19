const Header = (props) => {
  return (
    <h2>{props.course}</h2>
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

const CourseList = ({courses}) => {

  const courseList = courses.map((course) => {
    return (
      <>
      <Course course={course} />
      <Total contents={course.parts} />
      </>
    )
  })
  return (
    <>
      <h1>Web dev curriculum</h1>
      {courseList}
    </>
  )
}

const App = () => {
  const courses = [
    {
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
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]
  return (
    <div>
      <CourseList courses={courses} />
    </div>
  )
}

export default App