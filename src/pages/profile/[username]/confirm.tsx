'use client'

import { Ban, CheckCheck } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import versus from '@/assets/versus.png'
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
import { confirmMatchUseCase } from '@/useCases/match/confirm-match.useCase'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export default function ConfirmPage() {
  const [player, setPlayer] = useState({})
  const [playerDraft, setPlayerDraft] = useState({})
  const [matchesToConfirm, setMatchesToConfirm] = useState([])

  // const getPlayerByEmail = async () => {
  //   try {
  //     const response = await api.get('/player/email/ogro@levva.io')
  //     response.data.schedule = fixSchedule(response.data.schedule)
  //     setPlayer(response.data)
  //   } catch (error) {
  //     console.error('Erro na busca de jogadores:', error.message)
  //     if (error.response) {
  //       console.error('Status do erro:', error.response.status)
  //       console.error('Dados do erro:', error.response.data)
  //     }
  //   }
  // }

  // const getPlayerDraft = async () => {
  //   try {
  //     const response = await api.get(
  //       '/draft_by_edition/15/player/' + player.idplayer,
  //     )
  //     setPlayerDraft(response.data)
  //   } catch (error) {
  //     console.error('Erro na busca de jogadores:', error.message)
  //     if (error.response) {
  //       console.error('Status do erro:', error.response.status)
  //       console.error('Dados do erro:', error.response.data)
  //     }
  //   }
  // }

  // const getScheduledMatches = async () => {
  //   try {
  //     const response = await api.get(
  //       '/matches/scheduled/15/' + playerDraft.team.idteam,
  //     )
  //     setMatchesToConfirm(response.data)
  //   } catch (error) {
  //     console.error('Erro na busca de jogadores:', error.message)
  //     if (error.response) {
  //       console.error('Status do erro:', error.response.status)
  //       console.error('Dados do erro:', error.response.data)
  //     }
  //   }
  // }

  const handleConfirm = (match) => {
    confirmMatchUseCase.execute(player, playerDraft, match)
  }

  const handleReschedule = (match) => {
    console.log(match.idmatch)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playerResponse = await api.get('/player/email/ogro@levva.io')
        const playerData = {
          ...playerResponse.data,
          schedule: fixSchedule(playerResponse.data.schedule),
        }
        setPlayer(playerData)

        const draftResponse = await api.get(
          '/draft_by_edition/15/player/' + playerData.idplayer,
        )
        setPlayerDraft(draftResponse.data)

        const matchesResponse = await api.get(
          '/matches/scheduled/15/' + draftResponse.data.team.idteam,
        )
        setMatchesToConfirm(matchesResponse.data)
      } catch (error) {
        console.error('Erro no carregamento:', error)
      }
    }

    fetchData()
  }, [])

  // useEffect(() => {
  //   getPlayerDraft()
  // }, [player])

  // useEffect(() => {
  //   getScheduledMatches()
  // }, [playerDraft])

  return (
    <>
      <HeadMetatags title="Confirmar Partidas" description="Confirmar" />
      <div className="p-4 overflow-hidden flex w-full min-h-screen items-center justify-center">
        <div className="flex flex-col pb-12 rounded animate-in fade-in shadow-lg transition-all duration-1000 bg-white w-full max-w-[1000px] my-4 backdrop-filter backdrop-blur-lg bg-opacity-40 border-t border-t-gray-200">
          <div className="flex w-full items-center justify-center mt-4 p-4">
            <div>
              {matchesToConfirm && matchesToConfirm.length > 0 ? (
                <ul>
                  {matchesToConfirm.map((match, index) => (
                    <li key={index} className="flex items-center gap-4 mt-2">
                      <p>
                        <strong>{match.team1.name}</strong>
                      </p>
                      <Image
                        src={versus}
                        alt="img"
                        width={30}
                        className="self-center"
                        priority
                      />
                      <p>
                        <strong>{match.team2.name}</strong>
                      </p>
                      <p>
                        <strong>
                          <li key={index} className="flex items-center gap-4">
                            <p>
                              <strong>
                                {new Date(match.scheduledDate)
                                  .toLocaleDateString('pt-BR', {
                                    weekday: 'long',
                                  })
                                  .replace(/^\w/, (c) => c.toUpperCase())}
                              </strong>{' '}
                            </p>
                            <p>
                              <p>
                                {new Date(
                                  match.scheduledDate,
                                ).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                })}
                              </p>{' '}
                            </p>
                            <p>
                              <strong>
                                {new Date(
                                  match.scheduledDate,
                                ).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </strong>{' '}
                            </p>
                          </li>
                        </strong>{' '}
                      </p>

                      <Button
                        className="flex justify-center items-center gap-2 bg-gradient-to-r from-green-800 via-green-700 to-green-600"
                        onClick={() => handleConfirm(match)}
                      >
                        <>
                          <CheckCheck className="h-6" />
                          <span className="text-md">Confirmo</span>
                        </>
                      </Button>
                      <Button
                        className="flex justify-center items-center gap-2 bg-gradient-to-r from-red-800 via-red-700 to-red-600"
                        onClick={() => handleReschedule(match)}
                      >
                        <>
                          <Ban className="h-6" />
                          <span className="text-md ml-2">Remarcar</span>
                        </>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Não há partidas agendadas para confirmar.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
