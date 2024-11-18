import api from '@/clients/api'

const execute = async (data) => {
  try {
    const response = await api.post('/user', data)
    console.log(response.data)
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
