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

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const modify = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const body = {
    title: newObject.title,
    author: newObject.author,
    url: newObject.url,
    likes: newObject.likes,
    user: newObject.user.id
  }

  const response = await axios.put(`${baseUrl}/${newObject.id}`, body, config)
  return response.data
}

const remove = async blogId => {
  const config = {
    headers: { Authorization: token }
  }

  await axios.delete(`${baseUrl}/${blogId}`, config)
}

export default { getAll, create, setToken, modify, remove }