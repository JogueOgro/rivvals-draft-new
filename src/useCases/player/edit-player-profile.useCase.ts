import api from '@/clients/api'

const execute = async (form, file) => {
  if (file) {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const response = await api.put(
        '/player/picture/' + form.idplayer,
        formData,
      )
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

  try {
    const response = await api.put('/player/' + form.idplayer, form)
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

export const editPlayerProfile = { execute }
