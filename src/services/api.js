import axios from 'axios'

// Axios instance with base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Interceptor automatically attach the JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth
export const login = (credentials) => api.post('/auth/login', credentials)
export const register = (userData) => api.post('/auth/register', userData)

// Climbing Routes
export const getRoutes = () => api.get('/climbingroute')
export const getRoute = (id) => api.get(`/climbingroute/${id}`)
export const createRoute = (data) => api.post('/climbingroute', data)
export const updateRoute = (id, data) => api.put(`/climbingroute/${id}`, data)
export const deleteRoute = (id) => api.delete(`/climbingroute/${id}`)

// Bookings
export const getBookings = () => api.get('/booking')
export const getBooking = (id) => api.get(`/booking/${id}`)
export const createBooking = (data) => api.post('/booking', data)
export const updateBooking = (id, data) => api.put(`/booking/${id}`, data)
export const deleteBooking = (id) => api.delete(`/booking/${id}`)

// Sessions
export const getSessions = () => api.get('/session')
export const createSession = (data) => api.post('/session', data)
export const deleteSession = (id) => api.delete(`/session/${id}`)

// Memberships
export const getMemberships = () => api.get('/membership')
export const createMembership = (data) => api.post('/membership', data)
export const updateMembership = (id, data) => api.put(`/membership/${id}`, data)
export const deleteMembership = (id) => api.delete(`/membership/${id}`)

// Route Attempts
export const getAttempts = () => api.get('/routeattempt')
export const createAttempt = (data) => api.post('/routeattempt', data)
export const deleteAttempt = (id) => api.delete(`/routeattempt/${id}`)

// Route Likes
export const getLikes = () => api.get('/routelike')
export const createLike = (data) => api.post('/routelike', data)
export const deleteLike = (id) => api.delete(`/routelike/${id}`)