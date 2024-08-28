import axios from 'axios'

const getApiHost = (): string => {
  const isDev = process.env.NODE_ENV !== 'production'
  const link = isDev
    ? process.env.NEXT_PUBLIC_API_HOST_LOCAL
    : process.env.NEXT_PUBLIC_API_HOST
  return link || ''
}

const api = axios.create({
  baseURL: getApiHost(),
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(async (config) => {
  return config
})

api.interceptors.request.use((config) => {
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export default api
