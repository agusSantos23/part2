import { useEffect, useState } from 'react'
import personsService from './services/persons'

const Filter = ({searchedChange}) => {

  return(
    <>
      <form>
        filter shown with <input onChange={searchedChange} />
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

const Phonebook = ({searchedResults, deleat}) =>{

  return(
    <>
      {searchedResults.map( person =>   
        <p key={person.id}>{person.name + " " + person.number } <button onClick={() => {deleat(person)}}>Delete</button> </p>  
      )}
    </>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState(0)
  const [searchedResults, setSearchedResults] = useState([])
  
  
  useEffect(() =>{
    personsService
      .getAll()
      .then(response => {
        setPersons(response.data)
        setSearchedResults(response.data)
      })
  },[])

  const addName = (event) => {
    event.preventDefault()
    
    if(persons.some(person => person.name === newName)){
      
      updatePerson()
      setNewName("")
      setNewNumber("")

    }else{
      const id = persons.length+1
      const personObject = {
        name: newName,
        number: newNumber,
        id: id.toString()
      }
  
      personsService
        .create(personObject)
        .then(response =>{
          setPersons(persons.concat(response.data))
          setNewName("")
          setNewNumber("")
        })
    }
  }

  const nameChange = (event) => {
    
    setNewName(event.target.value)
  }

  const numberChange = (event) =>{

    setNewNumber(event.target.value)
  }

  const updatePerson = () =>{

    if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
      const thePerson = persons.find(person => person.name === newName)
      const newObject = {...thePerson, number:newNumber}

      personsService.update(thePerson.id,newObject)

    }

  }

  const searchedChange = (event) =>{
    
    const searchText = event.target.value.toLowerCase();
    

    if (searchText === "") {
      setSearchedResults(persons);
    } else {
      setSearchedResults(persons.filter(person =>
        person.name.toLowerCase().includes(searchText)
      ));
    }
  
  }

  const deleat = person =>{
    if(window.confirm(`Delete ${person.name} ?`)){

      personsService.deleat(person.id)

      personsService
        .getAll()
        .then(response => {
          setPersons(response.data)
          setSearchedResults(response.data)
        })
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>

      <Filter searchedChange = {searchedChange}/>
        
      <h2>add a new</h2>
      
      <NewPerson  
        addName={addName} 
        nameChange={nameChange} 
        numberChange={numberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>

      <Phonebook searchedResults={searchedResults} deleat = {deleat}/>
      
    </div>
  )
}

export default App