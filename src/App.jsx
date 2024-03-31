import { useEffect, useState } from 'react'
import personsService from './services/persons'


const Notif = ({notification,valor}) => {
  let css = "notif"

  if(valor){
    css += " t"
  }else{
    css += " f"
  }

  if(notification === null){
    return null
  }

  return(
    <>
      <span className={css}>{notification}</span>
    </>
  )

}


const Filter = ({searchedChange}) => {

  return(
    <h4>
      <form>
        filter shown with <input onChange={searchedChange} />
      </form>
    </h4>
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
  const [notification, setNotification] = useState(null)
  const [valor,setValor] = useState()
  

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

      setNotification(`Added ${newName}`)
      setValor(true)
      setTimeout(() =>{
        setNotification(null)
      }, 5000)
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

      personsService
      .update(thePerson.id,newObject)
      .catch(error =>{

        setNotification("An error occurred while performing the operation")
        setValor(false)
      })


      setNotification(`${thePerson.name}'s number has been modified to ${newNumber}`)
      setValor(true)
      setTimeout(() =>{
        setNotification(null)
      }, 30000)

      setNewName("")
      setNewNumber("")
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
      <Notif notification={notification} valor={valor}/>

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