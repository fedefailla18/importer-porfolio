import axios from 'axios'

const API_URL = 'http://localhost:8080/api/auth/'

export const register = (username: any, email: any, password: any) => {
  return axios.post(API_URL + 'register', {
    username,
    email,
    password,
  })
}

export const login = async (username: any, password: any) => {
  const response = await axios.post(API_URL + 'login', {
    username,
    password,
  })
  if (response.data.jwt) {
    localStorage.setItem('token', response.data.jwt)
  }
  return response.data
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
