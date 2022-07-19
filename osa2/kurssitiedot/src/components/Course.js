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
  
const Content = ({courseId, contents}) => {
  const courses = contents.map((item)=>{
      return <Part key={courseId + "." + item.id} name={item.name} exercises={item.exercises} />
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
    <Content courseId={course.id} contents={course.parts} />
    </>
  )
}
  
const CourseList = ({courses}) => {
  const courseList = courses.map((course) => {
    return (
      <div key={"course-"+course.id}>
        <Course course={course} />
        <Total contents={course.parts} />
      </div>
    )
  })
  return (
    <>
      <h1>Web dev curriculum</h1>
      {courseList}
    </>
  )
}

export default CourseList