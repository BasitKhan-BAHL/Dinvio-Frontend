import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8050',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token from localStorage for every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
