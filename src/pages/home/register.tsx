/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
'use client'

import { ArrowRight, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import bannerImg from '@/assets/banner_rocket.png'
import instaImg from '@/assets/instagram.png'
import twitchImg from '@/assets/twitch.png'
import HeadMetatags from '@/components/head-metatags'
import LottiePlayer from '@/components/lottie-player'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createUser } from '@/useCases/user/create-user.useCase'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'


const defaultValues = {
  twitch: '',
  name: undefined,
  email: undefined,
  password: undefined,
}

const formSchema = z.object({
  name: z.string().min(1, '* Campo obrigatório'),
  email: z.string().email('* E-mail inválido'),
  twitch: z.string(),
  password: z.string().min(6, {message: 'Senha precisa ter no mínimo 6 caracteres'})
})

export default function FormPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmited, setIsSubmited] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    setIsLoading(true)

    createUser.execute({
      ...formData,
      edition: 15,
      game: 'Rocket League',
    });
    setIsSubmited(true);
  }

  useEffect(() => {
    form.reset(defaultValues)
    setIsSubmited(false)
  }, [])

  return (
    <>
      <HeadMetatags
        title="Register"
        description="Criar conta"
      />
      <div className="p-4 overflow-hidden flex w-full min-h-screen items-center justify-center">
        <div className="flex flex-col pb-12 rounded animate-in fade-in shadow-lg transition-all duration-1000 bg-white w-full max-w-[1000px] my-4 backdrop-filter backdrop-blur-lg bg-opacity-40">
          <Image src={bannerImg} alt="img" className="self-center" priority/>
          <div className="flex w-full items-center justify-center mt-4 p-4">
            {isSubmited ? (
              <div className="text-center flex items-center justify-center flex-col">
                <div className="w-20 h-20">
                  <LottiePlayer
                    path="/static/success_animation.json"
                    loop={false}
                  />
                </div>
                <h1 className="font-bold text-3xl text-center text-green-600">
                  Sucesso!!!
                </h1>
                <p className="mt-2 text-center max-w-[600px]">
                  Obrigado por se registrar. <Link
                        href="/home"
                        rel="noopener noreferrer"
                        className="p-1 text-decoration-line: underline"
                      >
                        Clique Aqui
                      </Link>
                      para fazer login
                </p>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <Link
                    target="_blank"
                    href="https://www.twitch.tv/rivvalsgg"
                    className="p-2 rounded border bg-white"
                  >
                    <Image
                      src={twitchImg}
                      alt="Twitch"
                      width={30}
                      height={32}
                      className="h-auto w-full"
                      priority
                    />
                  </Link>
                  <Link
                    target="_blank"
                    href="https://www.instagram.com/rivvals.gg"
                    className="p-2 rounded border bg-white"
                  >
                    <Image
                      src={instaImg}
                      alt="Instagram"
                      width={30}
                      height={32}
                      className="h-auto w-full"
                      priority
                    />
                  </Link>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form
                  className="w-full flex flex-col max-w-[900px] gap-2 items-center"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full px-6">
                          <FormLabel>Nome *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite seu nome completo"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="w-full px-6">
                          <FormLabel>E-mail *</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite seu e-mail" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="twitch"
                      render={({ field }) => (
                        <FormItem className="w-full px-6">
                          <FormLabel>Usuário da twitch</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Insira seu nome de usuário da Twitch"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full px-6">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Senha *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite uma senha"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    disabled={isLoading}
                    type="submit"
                    className="w-1/2 flex justify-center items-center gap-2 mt-12 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-7 w-7 animate-spin" />
                        <span className="text-md ml-2">Carregando...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-md">Registrar</span>
                        <ArrowRight className="ml-2 h-6" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
