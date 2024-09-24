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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { subscribePlayer } from '@/useCases/player/subscribe-player.useCase'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'


const defaultValues = {
  twitch: '',
  name: undefined,
  email: undefined,
  capitao_ou_reserva: undefined,
  jajogou: undefined,
  frequencia: undefined,
  modos: undefined,
  nivel_ranqueado: '',
  items: [],
}

const items = [
  {
    id: 'controle',
    label: 'Controle de bola (manter a bola em cima do carro)',
  },
  {
    id: 'saltos',
    label: 'Saltos aéreos (impulsionar o carro no ar para atingir a bola)',
  },
  {
    id: 'powerslide',
    label: 'Powerslide (freio de mão para fazer curvas e controlar o carro)',
  },
  {
    id: 'wallhits',
    label: 'Wall hits (atingir a bola enquanto ela está nas paredes)',
  },
  {
    id: 'posicionamento',
    label:
      'Rotação e posicionamento (sabe se posicionar bem dentro do campo, em sintonia com o time)',
  },
  {
    id: 'impulsos',
    label:
      'Gerenciamento de impulsos (coletar e usar boosts para ter velocidade extra)',
  },
  {
    id: 'leitura_de_jogo',
    label:
      'Leitura de jogo (domina o game e consegue prever movimentos do oponente)',
  },
] as const

const formSchema = z.object({
  name: z.string().min(1, '* Campo obrigatório'),
  email: z.string().email('* E-mail inválido'),
  twitch: z.string(),
  capitao_ou_reserva: z.enum(['normal', 'capitao', 'reserva'], {
    required_error: 'Você deixou alguma opção em branco!',
  }),
  jajogou: z.enum(['claro', 'aprender'], {
    required_error: 'Você deixou alguma opção em branco!',
  }),
  frequencia: z.enum(['rivvals', '1x', '3x', 'sempre'], {
    required_error: 'Você deixou alguma opção em branco!',
  }),
  modos: z.enum(['casual', 'ranqueado'], {
    required_error: 'Você deixou alguma opção em branco!',
  }),
  nivel_ranqueado: z.string().min(0),
  outros_jogos: z.string().optional().or(z.literal('')),
  items: z.array(z.string()),
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

    subscribePlayer.execute({
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
        title="Inscrição Rocket League"
        description="Inscrição Rivvals Rocket League - Edição 15"
      />
      <div className="p-4 overflow-hidden flex w-full min-h-screen items-center justify-center">
        <div className="flex flex-col pb-12 rounded animate-in fade-in shadow-lg transition-all duration-1000 bg-white w-full max-w-[1000px] my-4 backdrop-filter backdrop-blur-lg bg-opacity-40">
          <Image src={bannerImg} alt="img" className="self-center" />
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
                  Obrigado por se inscrever no RIVVALS, Edição 15! 🚀 Fique
                  atento nas nossas comunidades para ver o que vai rolar. Boa
                  sorte e divirta-se!
                </p>
                <p className="pb-2 text-center max-w-[600px]">
                  Vamos fazer desse evento um momento incrível juntos.
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
                    />
                  </Link>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form
                  className="flex flex-col max-w-[900px] gap-2"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Nome</FormLabel>
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
                        <FormItem className="w-full">
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
                        <FormItem className="w-full">
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
                  <FormField
                    control={form.control}
                    name="capitao_ou_reserva"
                    render={({ field: { value, onChange } }) => (
                      <FormItem className="space-y-3 mt-6">
                        <FormLabel>
                          Gostaria de se cadastrar como capitão ou reserva?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => onChange(value)}
                            defaultValue={value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="normal" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Só jogar, normalzinho mesmo.
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="capitao" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Sim, gostaria de ser capitão do meu time!
                                (Pontos Bonus)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="reserva" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Minha agenda é apertada, quero me cadastrar mas
                                como reserva!
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jajogou"
                    render={({ field }) => (
                      <FormItem className="space-y-3 mt-6">
                        <FormLabel>Já jogou Rocket League?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(value)}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="claro" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Claro, vou voar! &#128640;
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="aprender" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Não, preciso aprender! &#128118;
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="frequencia"
                    render={({ field }) => (
                      <FormItem className="space-y-3 mt-6">
                        <FormLabel>Se joga, com que frequência? ⏳</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(value)}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="rivvals" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Só nos Rivvals.
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="1x" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                1 vez por semana...
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="3x" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                2, 3 vezes por semana...
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="sempre" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Sempre que consigo.
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="modos"
                    render={({ field }) => (
                      <FormItem className="space-y-3 mt-6">
                        <FormLabel>Que modos joga?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(value)}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="casual" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Casual, só pra divertir!
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="ranqueado" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Ranqueado, sou tryhard!
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nivel_ranqueado"
                    render={({ field }) => (
                      <FormItem className="space-y-3 mt-6">
                        <FormLabel>Qual o seu maior nível ranqueado?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(value)}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="zero" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Nunca tive. 😵
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="bronze" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Bronze, Prata ou Ouro.
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="dima" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Platina ou Diamante.
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="max" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Campeão, Grão Mestre ou Supersônico.
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="outros_jogos"
                    render={({ field }) => (
                      <FormItem className="space-y-3 mt-6">
                        <FormLabel>
                          Quais outros jogos vc pratica e quais seus níveis
                          ranqueados?
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            defaultValue={'Nenhum'}
                            placeholder="Por favor seja detalhista"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormItem className="space-y-3 mt-6">
                    <div className="mb-4">
                      <FormLabel>Quais habilidades você domina?</FormLabel>
                    </div>
                    <FormField
                      control={form.control}
                      name="items"
                      render={({ field }) => {
                        return (
                          <>
                            {items.map((item) => (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                          ...(field?.value || []),
                                          item.id,
                                        ])
                                        : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id,
                                          ),
                                        )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </>
                        )
                      }}
                    />
                  </FormItem>
                  <Button
                    disabled={isLoading}
                    type="submit"
                    className="w-full flex items-center gap-2 mt-12 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-7 w-7 animate-spin" />
                        <span className="text-md ml-2">Carregando...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-md">Confirmar Inscrição</span>
                        <ArrowRight className="ml-2 h-6 w-6" />
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
