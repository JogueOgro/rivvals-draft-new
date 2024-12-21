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

export default function ConfirmMatch(props) {
  const player = props.player
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
  console.log(player.idplayer)

  useEffect(() => {
    const fetchData = async () => {
      if (!player?.idplayer) return
      try {
        const draftResponse = await api.get(
          '/draft_by_edition/15/player/' + player.idplayer,
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
  }, [player])

  return (
    <>
      <div className="p-4 flex w-full">
        <div className="flex flex-col rounded animate-in fade-in shadow-lg transition-all duration-1000 bg-white w-full max-w-[1000px] backdrop-filter backdrop-blur-lg bg-opacity-40 border-t border-t-gray-200">
          <div className="flex w-full p-4">
            <div>
              {matchesToConfirm && matchesToConfirm.length > 0 ? (
                <ul>
                  {matchesToConfirm.map((match, index) => {
                    const isPlayerConfirmed =
                      match.confirmation.confirmedIds.includes(player.idplayer)

                    return (
                      <li key={index} className="gap-10">
                        <div className="flex items-center gap-4 mt-2">
                          <div className="teams mt-2 w-full max-w-[500px] flex justify-between">
                            <p className="text-sm w-25 mr-4">
                              <strong>{match.team1.name}</strong>
                            </p>
                            <Image
                              src={versus}
                              alt="img"
                              width={20}
                              className="self-center"
                              priority
                            />
                            <p className="text-sm w-25 ml-4">
                              <strong>{match.team2.name}</strong>
                            </p>
                          </div>

                          <div className="ml-auto"></div>
                          <div className="flex items-center gap-4">
                            <p>
                              <strong className="text-sm">
                                {new Date(match.scheduledDate)
                                  .toLocaleDateString('pt-BR', {
                                    weekday: 'short',
                                  })
                                  .replace(/^\w/, (c) => c.toUpperCase())}
                              </strong>
                            </p>
                            <strong className="text-sm">
                              {new Date(match.scheduledDate).toLocaleDateString(
                                'pt-BR',
                                {
                                  day: '2-digit',
                                  month: '2-digit',
                                },
                              )}
                            </strong>
                            <p>
                              <strong className="text-sm">
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
                                className="pl-2 flex justify-center items-center bg-gradient-to-r from-green-800 via-green-700 to-green-600"
                                onClick={() => handleConfirm(match)}
                              >
                                <CheckCheck className="h-4 pl-0" />
                                <span className="text-xs">Confirmar</span>
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button className="pl-2 flex justify-center items-center bg-gradient-to-r from-red-800 via-red-700 to-red-600">
                                    <Ban className="h-4 pl-0" />
                                    <span className="text-xs ml-1">
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
