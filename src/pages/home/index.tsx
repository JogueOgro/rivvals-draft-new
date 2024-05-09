'use client'

import { useStore } from 'effector-react'
import { Upload } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'

import logoImg from '@/assets/logo.png'
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
import ModalUploadPlayers from '@/components/upload-players'
import { draftEvent } from '@/store/draft/draft-events'
import draftStore from '@/store/draft/draft-store'
import { playerEvent } from '@/store/player/player-events'

import DownloadButton from '../player/download-button'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const defaultValues = {
  name: undefined,
  teamPlayersQuantity: undefined,
  teamsQuantity: undefined,
}

const formSchema = z.object({
  name: z.string().min(1, '* Campo obrigatório'),
  teamPlayersQuantity: z.string().min(1, '* Campo obrigatório'),
  teamsQuantity: z.string().min(1, '* Campo obrigatório'),
})

export default function LoginPage() {
  const { config } = useStore(draftStore)

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(formSchema),
  })

  return (
    <>
      <HeadMetatags title="Draft" />
      <div className="bg-muted overflow-hidden flex w-full min-h-screen items-center justify-center">
        <div className="flex flex-col py-4 rounded-3xl animate-in fade-in shadow-lg transition-all duration-1000 bg-white border-md min-w-[30vw] pb-12 backdrop-filter backdrop-blur-lg bg-opacity-30">
          <Image
            src={logoImg}
            alt="ilustratoin"
            width={180}
            className="self-center"
          />
          <h1 className="text-4xl font-bold text-zinc-900 text-center">
            Rivvals Draft
          </h1>
          <div className="flex w-full items-center justify-center mt-4">
            <Form {...form}>
              <form
                className="flex flex-col max-w-[500px] gap-2"
                onSubmit={form.handleSubmit((formData) => {
                  draftEvent({
                    config: {
                      name: formData!.name,
                      teamPlayersQuantity:
                        formData!.teamPlayersQuantity.toString(),
                      teamsQuantity: formData!.teamsQuantity.toString(),
                    },
                  })
                  playerEvent({ openModalUpload: true })
                })}
              >
                <FormField
                  control={form.control}
                  name="name"
                  defaultValue={config?.name}
                  render={({ field: { value, onChange, name } }) => (
                    <FormItem className="min-w-80">
                      <FormLabel>Nome do Jogo *</FormLabel>
                      <FormControl>
                        <Input
                          key={name}
                          name={name}
                          placeholder="Digite aqui"
                          value={value?.toString()}
                          onChange={(event) => onChange(event.target.value)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="w-full flex items-center justify-between gap-4">
                  <FormField
                    control={form.control}
                    name="teamsQuantity"
                    defaultValue={config?.teamsQuantity}
                    render={({ field: { value, onChange, name } }) => (
                      <FormItem className="w-full">
                        <FormLabel>Quantidade de Times *</FormLabel>
                        <FormControl>
                          <Input
                            key={name}
                            name={name}
                            placeholder="Digite aqui"
                            value={value?.toString()}
                            onChange={(event) => onChange(event.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="teamPlayersQuantity"
                    defaultValue={config?.teamPlayersQuantity}
                    render={({ field: { value, onChange, name } }) => (
                      <FormItem className="w-full">
                        <FormLabel>Players por time *</FormLabel>
                        <FormControl>
                          <Input
                            key={name}
                            name={name}
                            placeholder="Digite aqui"
                            value={value?.toString()}
                            onChange={(event) => onChange(event.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full flex-col flex justify-center mt-8 gap-4">
                  <DownloadButton text="Baixar template de importação" />
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid}
                    className="w-full bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
                  >
                    <div className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      <span>Upload arquivo de importação&nbsp;&nbsp;</span>
                    </div>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <ModalUploadPlayers />
    </>
  )
}
