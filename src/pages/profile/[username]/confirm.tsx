'use client'

import { ArrowRight, Loader2, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

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
import { fixSchedule, sortDays, weekDays } from '@/lib/utils'
import { editPlayerProfile } from '@/useCases/player/edit-player-profile.useCase'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const formSchema = z.object({
  idplayer: z.number().optional(),
  name: z.string().min(1, '* Campo obrigatório'),
  nick: z.string().optional(),
  email: z.string().email('* E-mail inválido'),
  twitch: z.string().optional(),
  steam: z.string().optional(),
  riot: z.string().optional(),
  epic: z.string().optional(),
  xbox: z.string().optional(),
  psn: z.string().optional(),
})

export default function ConfirmPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [player, setPlayer] = useState({})
  const [playerDraft, setPlayerDraft] = useState({})
  const [matchesToConfirm, setMatchesToConfirm] = useState([])

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'all',
    defaultValues: player,
    resolver: zodResolver(formSchema),
  })

  const getPlayerByEmail = async () => {
    try {
      const response = await api.get('/player/email/ogro@levva.io')
      response.data.schedule = fixSchedule(response.data.schedule)
      setPlayer(response.data)
    } catch (error) {
      console.error('Erro na busca de jogadores:', error.message)
      if (error.response) {
        console.error('Status do erro:', error.response.status)
        console.error('Dados do erro:', error.response.data)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getPlayerDraft = async () => {
    try {
      const response = await api.get(
        '/draft_by_edition/15/player/' + player.idplayer,
      )
      setPlayerDraft(response.data)
    } catch (error) {
      console.error('Erro na busca de jogadores:', error.message)
      if (error.response) {
        console.error('Status do erro:', error.response.status)
        console.error('Dados do erro:', error.response.data)
      }
    }
  }

  const getScheduledMatches = async () => {
    try {
      const response = await api.get(
        '/matches/scheduled/15/' + playerDraft.team.idteam,
      )
      setMatchesToConfirm(response.data)
    } catch (error) {
      console.error('Erro na busca de jogadores:', error.message)
      if (error.response) {
        console.error('Status do erro:', error.response.status)
        console.error('Dados do erro:', error.response.data)
      }
    }
  }

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    setIsLoading(true)
    editPlayerProfile.execute(formData, selectedFile)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file || null)
  }

  useEffect(() => {
    getPlayerByEmail()
  }, [])

  useEffect(() => {
    getPlayerDraft()
  }, [player])

  useEffect(() => {
    getScheduledMatches()
  }, [playerDraft])

  // useEffect(() => {
  //   form.reset(player)
  // }, [player, form])

  return (
    <>
      <HeadMetatags title="Confirmar Partidas" description="Confirmar" />
      <div className="p-4 overflow-hidden flex w-full min-h-screen items-center justify-center">
        <div className="flex flex-col pb-12 rounded animate-in fade-in shadow-lg transition-all duration-1000 bg-white w-full max-w-[1000px] my-4 backdrop-filter backdrop-blur-lg bg-opacity-40 border-t border-t-gray-200">
          <div className="flex w-full items-center justify-center mt-4 p-4">
            <Form {...form}>
              <form
                className="w-full flex flex-col max-w-[900px] gap-2 items-center"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div>
                  {matchesToConfirm && matchesToConfirm.length > 0 ? (
                    <ul>
                      {matchesToConfirm.map((match, index) => (
                        <li key={index}>
                          <div>
                            <p>
                              <strong>Time 1:</strong> {match.team1.name}
                            </p>
                            <p>
                              <strong>Time 2:</strong> {match.team2.name}
                            </p>
                            <p>
                              <strong>Data:</strong>{' '}
                              {new Date(match.matchDate).toLocaleString()}
                            </p>
                            <p>
                              <strong>Status:</strong> {match.status}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Não há partidas agendadas para confirmar.</p>
                  )}
                </div>
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="idplayer"
                    render={({ field }) => <input type="hidden" {...field} />}
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
                      <span className="text-md">Salvar</span>
                      <ArrowRight className="ml-2 h-6" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}
