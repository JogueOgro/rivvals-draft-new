import axios from 'axios'

const getApiHost = (): string => {
  const link =
    process.env.NEXT_PUBLIC_API_HOST ||
    process.env.NEXT_PUBLIC_API_HOST_LOCAL ||
    ''
  return link
}

const api = axios.create({
  baseURL: getApiHost(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
