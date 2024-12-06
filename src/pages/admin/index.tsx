'use client'

import { useUnit } from 'effector-react'
import { DatabaseBackup, Upload } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import logoImg from '@/assets/logo.png'
import HeadMetatags from '@/components/head-metatags'
import ModalQueryPlayers from '@/components/query-players'
import ModalQueryPlayersNew from '@/components/query-players-new'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import ModalUploadPlayers from '@/components/upload-players'
import { draftEvent } from '@/store/draft/draft-events'
import draftStore from '@/store/draft/draft-store'
import { playerEvent } from '@/store/player/player-events'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export type IType = undefined | 'new' | 'import' | 'database' | 'database_new'

const defaultValues = {
  name: undefined,
  teamPlayersQuantity: undefined,
  teamsQuantity: undefined,
}

export default function AdminPage() {
  const [type, setType] = useState<IType>(undefined)
  const { config } = useUnit(draftStore)

  const formSchema = z.object({
    game:
      type === 'database'
        ? z.string()
        : z.string().min(1, '* Campo obrigatório'),
    edition:
      type === 'database'
        ? z.string()
        : z.string().min(1, '* Campo obrigatório'),
    teamPlayersQuantity:
      type === 'database'
        ? z.string()
        : z.string().min(1, '* Campo obrigatório'),
    teamsQuantity:
      type === 'database'
        ? z.string()
        : z.string().min(1, '* Campo obrigatório'),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [])

  return (
    <>
      <HeadMetatags title="Draft" />
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
                onSubmit={form.handleSubmit((formData) => {
                  draftEvent({
                    config: {
                      game: formData!.game,
                      teamPlayersQuantity:
                        formData!.teamPlayersQuantity.toString(),
                      teamsQuantity: formData!.teamsQuantity.toString(),
                      edition: Number(formData!.edition),
                      draftDate: new Date(),
                    },
                  })
                  if (type === 'new' || type === 'import') {
                    playerEvent({ openModalUpload: true })
                  }
                  if (type === 'database') {
                    playerEvent({ openModalDB: true })
                  }
                  if (type === 'database_new') {
                    playerEvent({ openModalDBNew: true })
                  }
                })}
              >
                {type !== 'database' && type !== 'database_new' && (
                  <div className="w-full flex items-center justify-between gap-4">
                    <FormField
                      control={form.control}
                      name="game"
                      defaultValue={config?.game}
                      render={({ field: { value, onChange, name } }) => (
                        <FormItem className="w-full">
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
                    <FormField
                      control={form.control}
                      name="edition"
                      defaultValue="15"
                      render={({ field: { value, onChange, name } }) => (
                        <FormItem className="w-full">
                          <FormLabel>Edicao *</FormLabel>
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
                )}
                {type !== 'database' && type !== 'database_new' && (
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
                )}

                <RadioGroup
                  className="mt-4"
                  value={type}
                  onValueChange={(x) => setType(x as IType)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new" />
                    <Label htmlFor="new">Começar um draft novo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="import" id="import" />
                    <Label htmlFor="import">Importar um draft existente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="database_new" id="database_new" />
                    <Label htmlFor="new">Começar um draft novo (Banco)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="database" id="database" />
                    <Label htmlFor="import">
                      Carregar draft completo (Banco)
                    </Label>
                  </div>
                </RadioGroup>

                {type === 'new' && (
                  <div className="w-full flex-col flex justify-center mt-8 gap-4">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
                    >
                      <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        <span>Upload arquivo de importação&nbsp;&nbsp;</span>
                      </div>
                    </Button>
                  </div>
                )}

                {type === 'import' && (
                  <div className="w-full flex-col flex justify-center mt-8 gap-4">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
                    >
                      <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        <span>Upload do draft</span>
                      </div>
                    </Button>
                  </div>
                )}

                {type === 'database_new' && (
                  <div className="w-full flex-col flex justify-center mt-8 gap-4">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
                    >
                      <div className="flex items-center gap-2">
                        <DatabaseBackup className="w-5 h-5" />
                        <span>Iniciar</span>
                      </div>
                    </Button>
                  </div>
                )}

                {type === 'database' && (
                  <div className="w-full flex-col flex justify-center mt-8 gap-4">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
                    >
                      <div className="flex items-center gap-2">
                        <DatabaseBackup className="w-5 h-5" />
                        <span>Carregar dados</span>
                      </div>
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </div>
        </div>
      </div>

      {type === 'database_new' && <ModalQueryPlayersNew type={type} />}
      {type === 'database' && <ModalQueryPlayers type={type} />}
      {(type === 'new' || type === 'import') && (
        <ModalUploadPlayers type={type} />
      )}
    </>
  )
}
