import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.put(`${ baseUrl }/${newObject.id}`, newObject, config)
  return request.then(response => response.data)
}

const remove = deleteObject => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.delete(`${ baseUrl }/${deleteObject.id}`, config)
  return request.then(response => response.data)
}

const addComment = async newObject => {
  const response = await axios.post(`${baseUrl}/${newObject.id}/comments`, newObject)
  console.log(response.data)
  return response.data
}

export default { getAll, create, update, remove, setToken, addComment }