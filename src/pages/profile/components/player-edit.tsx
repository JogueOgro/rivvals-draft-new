'use client'

import { ArrowLeft, ArrowRight, Loader2, Upload } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { editPlayerProfile } from '@/useCases/player/edit-player-profile.useCase'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const formSchema = z.object({
  idplayer: z.number().optional(),
  name: z.string().min(1, '* Campo obrigatório'),
  nick: z.preprocess((value) => value ?? '', z.string()),
  email: z.string().email('* E-mail inválido'),
  twitch: z.preprocess((value) => value ?? '', z.string()),
  mobile: z.preprocess((value) => value ?? '', z.string()),
  favoriteGame: z.preprocess((value) => value ?? '', z.string()),
  steam: z.preprocess((value) => value ?? '', z.string()),
  riot: z.preprocess((value) => value ?? '', z.string()),
  epic: z.preprocess((value) => value ?? '', z.string()),
  xbox: z.preprocess((value) => value ?? '', z.string()),
  psn: z.preprocess((value) => value ?? '', z.string()),
})

export default function PlayerEdit(props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const player = props.player

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'all',
    defaultValues: player,
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    setIsLoading(true)
    await editPlayerProfile.execute(formData, selectedFile)
    await router.reload()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file || null)
  }

  useEffect(() => {
    setSelectedFile(null)
  }, [])

  useEffect(() => {
    form.reset(player)
  }, [player, form])

  return (
    <>
      <div className="p-4 overflow-hidden flex w-full min-h-screen items-center justify-center">
        <div className="flex flex-col pb-12 rounded animate-in fade-in shadow-lg transition-all duration-1000 bg-white w-full max-w-[1000px] my-4 backdrop-filter backdrop-blur-lg bg-opacity-40 border-t border-t-gray-200">
          <div className="flex w-full items-center justify-center mt-4 p-4">
            <Form {...form}>
              <form
                className="w-full flex flex-col max-w-[900px] gap-2 items-center"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="idplayer"
                    render={({ field }) => <input type="hidden" {...field} />}
                  />
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
                <div className="w-full px-6">
                  <FormField
                    control={form.control}
                    name="nick"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Nickname</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite um nickname" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full px-6">
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
                <div className="w-full px-6">
                  <FormLabel>Foto de Perfil</FormLabel>
                  {selectedFile == null && (
                    <div>
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full box-border bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 flex justify-center items-center gap-2"
                      >
                        <Upload className="w-5 h-5" />
                        <span>Upload de Arquivo&nbsp;&nbsp;</span>
                      </Button>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".jpg, .jpeg, .png"
                        ref={fileInputRef}
                      />
                    </div>
                  )}
                  {selectedFile !== null && (
                    <div className="mt-2">
                      <span>Arquivo selecionado: {selectedFile.name}</span>
                    </div>
                  )}
                  <div className="w-full flex items-center justify-between mt-2">
                    <span className="font-light text-sm text-zinc-400">
                      Formatos suportados: JPG, JPEG, PNG
                    </span>
                    <span className="font-light text-sm text-zinc-400">
                      Tamanho máximo: 10mb
                    </span>
                  </div>
                </div>

                <div className="w-full px-6">
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Celular</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite seu Celular" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="w-full flex items-center justify-between mt-2">
                    <span className="font-light text-sm text-zinc-400">
                      Acessível apenas para o administrador do sistema
                    </span>
                  </div>
                </div>

                <div className="w-full px-6">
                  <FormField
                    control={form.control}
                    name="twitch"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          Usuário da Twitch - Não tem Twitch?&nbsp;
                          <a
                            href="https://www.twitch.tv"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            Cadastre-se aqui
                          </a>
                        </FormLabel>
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
                    name="favoriteGame"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Game Favorito</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite seu Game Favorito"
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
                    name="riot"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Riot Id</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite seu Riot Id" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full px-6">
                  <FormField
                    control={form.control}
                    name="steam"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Steam</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Link para seu perfil Steam"
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
                    name="epic"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Epic</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite seu Epic Id" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full px-6">
                  <FormField
                    control={form.control}
                    name="xbox"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Xbox</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite seu usuário Xbox"
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
                    name="psn"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>PSN</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite seu usário PSN"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between items-center gap-2">
                  <div className="flex justify-between items-center gap-2 mt-12">
                    <Button
                      className="py-2 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
                      onClick={() => props.setVisibility('feed')}
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Voltar
                    </Button>

                    <Button
                      disabled={isLoading}
                      type="submit"
                      className="flex justify-center items-center gap-2 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-7 w-7 animate-spin" />
                          <span className="text-md ml-2">Carregando...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-md">Salvar</span>
                          <ArrowRight className="h-6" />
                        </>
                      )}
                    </Button>
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
