import { useEffect, useState } from 'react'
import axios from 'axios'



const Filter = ({fun}) => {

  return(
    <>
      <form>
        filter shown with <input onChange={fun} />
      </form>
    </>
  )
}

const NewPerson = ({addName, nameChange, numberChange, newName, newNumber}) => {

  return(
    <>
      <form onSubmit={addName}>
        <div>
          name: <input onChange={nameChange}/>
          number: <input onChange={numberChange}/>
          debug: {newName + " " + newNumber}
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}

const Phonebook = ({searchedResults}) =>{

  return(
    <>
      {searchedResults.map( person =>   
        <p key={person.id}>{person.name + " " + person.number } </p>  
      )}
    </>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState(0)
  const [searchedPerson, setSearchedPerson] = useState("")
  const [searchedResults, setSearchedResults] = useState([])

  useEffect(() =>{
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  })


  const addName = (event) => {
    event.preventDefault()
    
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length+1
    }

    setPersons(persons.concat(personObject))
    setNewName("")
    setNewNumber("")
  }

  const nameChange = (event) => {
    
    if(persons.some(person => person.name === event.target.value)){
      alert(`${event.target.value} is already added to phonebook` )
    }

    setNewName(event.target.value)
  }

  const numberChange = (event) =>{
    setNewNumber(event.target.value)
  }

  const searchedChange = (event) =>{
    setSearchedPerson(event.target.value)

    setSearchedResults(persons.filter(person => 

        person.name.toLowerCase().includes(searchedPerson.toLowerCase())

      ))

  }
  return (
    <div>
      <h1>Phonebook</h1>

      <Filter fun = {searchedChange}/>
        
      <h2>add a new</h2>
      
      <NewPerson  
        addName={addName} 
        nameChange={nameChange} 
        numberChange={numberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>

      <Phonebook searchedResults={searchedResults}/>
      
    </div>
  )
}

export default App