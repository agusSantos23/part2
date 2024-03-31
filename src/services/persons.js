import axios from 'axios'
const baseUrl = 'http://localhost:3000/persons'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const deleat = (id) =>{
  axios.delete(`${baseUrl}/${id}`)
  .then(response => 
      console.log(response.data)
    )
  .catch(error=>{
    console.error(error)
  })
} 

const update = (id, newObject) =>{


  const request = axios.put(`${baseUrl}/${id}`,newObject)
  return request.then(response=>response.data)
}

export default {getAll,create, deleat,update}