import React, { useState } from 'react'
import { Redirect } from 'react-router-dom';

import { Button } from '@/components/ui/button'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault()
    console.log(`Email: ${email}, Password: ${password}`)

    const data = {
      email,
      password,
    }

    try {
      const response = await fetch('http://localhost:5000/checkpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erro no login!')
      }

      const responseData = await response.json()
      console.log('Login feito com sucesso:', responseData)
      // Requer medidas adicionais de segurança, HTTPS e Criptografia
      localStorage.setItem('loggedIn', 'true');
      setLoggedIn(true);

    } catch (error) {
      console.error('Erro durante login:', error)
      // Trate erros de rede ou do servidor aqui
    }
  }

  if (loggedIn) {
    return <Redirect to="/user" />;
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
