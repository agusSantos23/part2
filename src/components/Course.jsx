const Data = ({parts}) =>{
  
    const total = parts.reduce((a, part) => {
      return a + part.exercises
    },0)
  
    return(
      <>
        <h2>total of {total} exercises</h2>
      </>
    )
}
  
const Part = ({part}) =>{
    
    return(
      <div key = {part.id}>
        <h3>{part.name}</h3>
        <h4>exercises: {part.exercises}</h4>
      </div>
    )
}
  
const Content = ({parts}) =>{
    
    return(
      <>
        {parts.map(part => 
          <Part key={part.id} part={part} />  
        )}
      </>
    )
}
  
const Header = ({title}) =>{
  
    return(
      <>
        <h2>{title}</h2>
      </>
    )
}

const Course = ({course}) =>{
    
    return(
        <div key = {course.id}>
          <Header title = {course.name}/>
          <Content parts = {course.parts}/>
          <Data parts = {course.parts}/>
        </div>
    )
}


export default Course