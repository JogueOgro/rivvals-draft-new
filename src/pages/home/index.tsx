'use client'

import { LogIn } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import logoImg from '@/assets/logo.png'
import api from '@/clients/api'
import HeadMetatags from '@/components/head-metatags'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authEvent } from '@/store/auth/auth-events'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export type IType = undefined | 'new' | 'import' | 'database' | 'database_new'

const defaultValues = {
  email: undefined,
  password: undefined,
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const route = useRouter()

  const formSchema = z.object({
    email: z.string(),
    password: z.string().min(1, '* Campo obrigatório'),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    const data = {
      email,
      password,
    }

    try {
      const response = await api.post('/checkpassword', data)
      const responseData = response.data
      console.log('Login feito com sucesso:')
      const username = email.split('.')[0]
      authEvent({
        username,
        email: data.email,
        loggedIn: true,
        date: new Date(),
        token: responseData,
      })
      route.push('/profile/' + username)
    } catch (error) {
      console.error('Erro durante login:', error.message)
      if (error.response) {
        console.error('Status do erro:', error.response.status)
        console.error('Dados do erro:', error.response.data)
      }
    }
  }

  return (
    <>
      <HeadMetatags title="Login" />
      <div className="bg-muted overflow-hidden flex w-full min-h-screen items-center justify-center">
        <div className="flex flex-col py-4 rounded-3xl animate-in fade-in shadow-lg transition-all duration-1000 bg-white border-md min-w-[30vw] pb-12 backdrop-filter backdrop-blur-lg bg-opacity-30">
          <Image
            src={logoImg}
            alt="img"
            width={180}
            className="self-center"
            priority
          />

          <div className="flex w-full items-center justify-center mt-4">
            <Form {...form}>
              <form
                className="flex flex-col max-w-[500px] gap-2"
                onSubmit={handleLogin}
              >
                <div className="w-full flex items-center justify-between gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field: { value, name } }) => (
                      <FormItem className="w-full">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            key={name}
                            name={name}
                            placeholder="ogro@levva.io"
                            value={value?.toString()}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full flex items-center justify-between gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field: { value, name } }) => (
                      <FormItem className="w-full">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            key={name}
                            name={name}
                            placeholder="ziriguidumdekodeko"
                            value={value?.toString()}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full flex-col flex justify-center mt-2 gap-2">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
                  >
                    <div className="flex items-center gap-2">
                      <LogIn className="w-5 h-5" />
                      <span>Entrar</span>
                    </div>
                  </Button>
                  <div className="w-full flex-col flex justify-center mt-1 gap-1 text-xs">
                    <span>
                      Nâo tem conta?
                      <Link
                        href="/home/register"
                        rel="noopener noreferrer" // Recomendado para segurança
                        className="p-1 text-decoration-line: underline"
                      >
                        Registre-se
                      </Link>
                    </span>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}
