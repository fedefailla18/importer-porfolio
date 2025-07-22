import Cookies from 'universal-cookie'
import axios from 'axios'

const cookies = new Cookies()

export const setAuthToken = (token: string) => {
  if (token) {
    cookies.set('auth_token', token, {
      path: '/',
      maxAge: 3600,
      sameSite: 'strict',
    })
    // Also set in localStorage for consistency
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    cookies.remove('auth_token', { path: '/' })
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }
}

export const getAuthToken = () => {
  const cookieToken = cookies.get('auth_token')
  const localToken = localStorage.getItem('token')
  return cookieToken || localToken
}

export const removeAuthToken = () => {
  cookies.remove('auth_token', { path: '/' })
  localStorage.removeItem('token')
  delete axios.defaults.headers.common['Authorization']
}

export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = getAuthToken()
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        try {
          const refreshToken = cookies.get('refresh_token')
          const response = await axios.post('/api/auth/refresh', {
            refreshToken,
          })
          const { token } = response.data
          setAuthToken(token)
          return axios(originalRequest)
        } catch (refreshError) {
          removeAuthToken()
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
      return Promise.reject(error)
    }
  )
}
