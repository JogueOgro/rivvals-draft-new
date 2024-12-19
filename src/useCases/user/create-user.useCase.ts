import api from '@/clients/api'

const execute = (data) => {
  try {
    api.post('/user', data)
  } catch (error) {
    const errorJson = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    }
    console.log('Error JSON:', errorJson)
  }

  try {
    api.post('/player', data)
  } catch (error) {
    const errorJson = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    }
    console.log('Error JSON:', errorJson)
  }
}

export const createUser = { execute }
