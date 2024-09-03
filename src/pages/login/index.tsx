import { useRouter } from 'next/router'
import React, { useState } from 'react'

import api from '@/clients/api'
import { Button } from '@/components/ui/button'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const route = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    console.log(`Email: ${email}, Password: ${password}`)

    const data = {
      email,
      password,
    }

    try {
      const response = await api.post('/checkpassword', data)
      const responseData = response.data
      console.log('Login feito com sucesso:', responseData)
      localStorage.setItem('loggedIn', 'true')
      setLoggedIn(true)
      route.push('/armadinho')
    } catch (error) {
      console.error('Erro durante login:', error.message)
      if (error.response) {
        console.error('Status do erro:', error.response.status)
        console.error('Dados do erro:', error.response.data)
      }
    }
  }

  return (
    <div className="login">
      <h2>Form Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-control">
          <label>Email:</label>
          <input
            placeholder="ogro@levva.io"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-control">
          <label>Password:</label>
          <input
            placeholder="ziriguidumdekodeko"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
        >
          Login
        </Button>
      </form>
    </div>
  )
}

export default Login
