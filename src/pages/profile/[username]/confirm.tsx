'use client'

import { Ban, CheckCheck } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import versus from '@/assets/versus.png'
import api from '@/clients/api'
import HeadMetatags from '@/components/head-metatags'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { fixStringToObj } from '@/lib/utils'
import { confirmMatchUseCase } from '@/useCases/match/confirm-match.useCase'
import { rescheduleMatchUseCase } from '@/useCases/match/reschedule-match.useCase'

export default function ConfirmPage() {
  const [player, setPlayer] = useState({})
  const [playerDraft, setPlayerDraft] = useState({})
  const [matchesToConfirm, setMatchesToConfirm] = useState([])
  const refReason = useRef(null)

  const handleConfirm = (match) => {
    confirmMatchUseCase.execute(player, playerDraft, match)
  }

  const handleReschedule = (match) => {
    setMatchesToConfirm((prevMatches) =>
      prevMatches.filter(
        (matchToConfirm) => matchToConfirm.idmatch !== match.idmatch,
      ),
    )
    rescheduleMatchUseCase.execute(player, refReason.current.value, match)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playerResponse = await api.get('/player/email/ogro@levva.io')
        const playerData = {
          ...playerResponse.data,
          schedule: fixStringToObj(playerResponse.data.schedule),
        }
        setPlayer(playerData)

        const draftResponse = await api.get(
          '/draft_by_edition/15/player/' + playerData.idplayer,
        )
        setPlayerDraft(draftResponse.data)

        const matchesResponse = await api.get(
          '/matches/scheduled/15/' + draftResponse.data.team.idteam,
        )

        let fixedConfirm
        for (const matchItem of matchesResponse.data) {
          fixedConfirm = fixStringToObj(matchItem.confirmation)
          matchItem.confirmation = fixedConfirm
        }

        setMatchesToConfirm(matchesResponse.data)
      } catch (error) {
        console.error('Erro no carregamento:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <HeadMetatags title="Confirmar Partidas" description="Confirmar" />
      <div className="p-4 overflow-hidden flex w-full min-h-screen items-center justify-center">
        <div className="flex flex-col pb-12 rounded animate-in fade-in shadow-lg transition-all duration-1000 bg-white w-full max-w-[1000px] my-4 backdrop-filter backdrop-blur-lg bg-opacity-40 border-t border-t-gray-200">
          <div className="flex w-full items-center justify-center mt-4 p-4">
            <div>
              {matchesToConfirm && matchesToConfirm.length > 0 ? (
                <ul>
                  {matchesToConfirm.map((match, index) => {
                    // Verificar se o player.idplayer está presente em confirmedIds para o match atual
                    const isPlayerConfirmed =
                      match.confirmation.confirmedIds.includes(player.idplayer)

                    return (
                      <li key={index} className="gap-10">
                        <div className="flex items-center gap-4 mt-8">
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
                          <div className="flex items-center gap-4">
                            <p>
                              <strong>
                                {new Date(match.scheduledDate)
                                  .toLocaleDateString('pt-BR', {
                                    weekday: 'long',
                                  })
                                  .replace(/^\w/, (c) => c.toUpperCase())}
                              </strong>
                            </p>
                            <p>
                              {new Date(match.scheduledDate).toLocaleDateString(
                                'pt-BR',
                                {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                },
                              )}
                            </p>
                            <p>
                              <strong>
                                {new Date(
                                  match.scheduledDate,
                                ).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </strong>
                            </p>
                          </div>

                          {match.confirmation.confirmedIds.length ===
                          match.confirmation.playersToConfirm ? (
                            <span className="text-green-800 text-md">
                              Jogo Confirmado
                            </span>
                          ) : isPlayerConfirmed ? (
                            <span className="text-gray-400 text-md">
                              Você confirmou!
                            </span>
                          ) : (
                            <div className="flex gap-4">
                              <Button
                                className="flex justify-center items-center gap-2 bg-gradient-to-r from-green-800 via-green-700 to-green-600"
                                onClick={() => handleConfirm(match)}
                              >
                                <CheckCheck className="h-6" />
                                <span className="text-md">Confirmar</span>
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button className="flex justify-center items-center gap-2 bg-gradient-to-r from-red-800 via-red-700 to-red-600">
                                    <Ban className="h-6" />
                                    <span className="text-md ml-2">
                                      Remarcar
                                    </span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Remarcação de Partida
                                    </DialogTitle>
                                  </DialogHeader>
                                  <span>
                                    As partidas foram marcadas de acordo com a
                                    agenda que você definiu no seu perfil, por
                                    qual razão você gostaria de remarcar?
                                  </span>
                                  <div className="grid gap-4 py-4">
                                    <div className="flex flex-col items-start gap-4">
                                      <input
                                        id="reason"
                                        className="w-full"
                                        ref={refReason}
                                      />
                                      <DialogClose asChild>
                                        <Button
                                          className="w-full justify-center items-center gap-2 bg-gradient-to-r from-red-800 via-red-700 to-red-600"
                                          onClick={() =>
                                            handleReschedule(match)
                                          }
                                        >
                                          <span className="text-md ml-2">
                                            Remarcar
                                          </span>
                                        </Button>
                                      </DialogClose>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4"></div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                        </div>
                        <div className="mt-2 block">
                          <HoverCard>
                            <HoverCardTrigger>
                              <span className="font-light text-sm text-zinc-400 block hover:cursor-pointer">
                                Confirmações - Detalhes
                              </span>
                            </HoverCardTrigger>
                            <HoverCardContent>
                              <span className="text-sm block">
                                {
                                  match.confirmation.playersConfirms.team1[0]
                                    .teamName
                                }
                              </span>
                              {match.confirmation.playersConfirms.team1.map(
                                (item, index) => (
                                  <span key={index} className="text-sm block">
                                    {item.nick}
                                    {' - '}
                                    <span
                                      key={index}
                                      className={`font-light text-sm ${item.ok ? 'text-green-800' : 'text-red-200'}`}
                                    >
                                      {item.ok ? 'Confirmado' : 'Pendente'}
                                    </span>
                                  </span>
                                ),
                              )}
                              <span className="text-sm block mt-2">
                                {
                                  match.confirmation.playersConfirms.team2[0]
                                    .teamName
                                }
                              </span>
                              {match.confirmation.playersConfirms.team2.map(
                                (item, index) => (
                                  <span key={index} className="text-sm block">
                                    {item.nick}
                                    {' - '}
                                    <span
                                      key={index}
                                      className={`font-light text-sm ${item.ok ? 'text-green-800' : 'text-red-200'}`}
                                    >
                                      {item.ok ? 'Confirmado' : 'Pendente'}
                                    </span>
                                  </span>
                                ),
                              )}
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                      </li>
                    )
                  })}
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
