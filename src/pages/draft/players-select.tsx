/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import { useStore } from 'effector-react'
import {
  ArrowLeft,
  ArrowLeftCircle,
  ArrowRight,
  ArrowRightCircle,
  Medal,
  Star,
  Trash2,
  Trophy,
} from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'

import PlayerCard from '@/components/card-player'
import DataTable from '@/components/data-table'
import LottiePlayer from '@/components/lottie-player'
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { IPlayer } from '@/domain/player.domain'
import { sleep } from '@/lib/utils'
import { draftEvent } from '@/store/draft/draft-events'
import draftStore from '@/store/draft/draft-store'
import playerStore from '@/store/player/player-store'

function getRandomTopPlayers(playerList: IPlayer[]) {
  if (playerList.length <= 5) return playerList
  else {
    const tops = playerList.length
    const selectedPlayers: IPlayer[] = []
    const selectedIndexes: number[] = []

    while (selectedPlayers.length < 5) {
      const randomIndex = Math.floor(Math.random() * tops)
      if (!selectedIndexes.includes(randomIndex)) {
        selectedIndexes.push(randomIndex)
        selectedPlayers.push(playerList[randomIndex])
      }
    }

    return selectedPlayers
  }
}

const audioStart = typeof window !== 'undefined' ? new Audio('/static/start.mp3') : null;
const audioClock = typeof window !== 'undefined' ? new Audio('/static/clock.mp3') : null;

const PlayersSelect = () => {
  const { config, activeTeamIndex, isOpenModalStart, isActiveTimer } =
    useStore(draftStore)
  const { players } = useStore(playerStore)
  const [listOfAllocatedPlayers, setListOfAllocatedPlayers] = useState<
    string[]
  >([])

  const dataSource = config?.teamList ? [...config.teamList] : []

  const filteredActiveTeam = [...dataSource]?.find((_, index) => {
    return index === activeTeamIndex
  })

  const filteredAvailablePlayers = [...players]?.filter((player) => {
    return !listOfAllocatedPlayers.includes(player.id!)
  })

  const listRandomPlayers = useMemo(
    () => getRandomTopPlayers(filteredAvailablePlayers),
    [listOfAllocatedPlayers],
  )

  function onPlayerSelect(selectedPlayer: IPlayer) {
    if (audioClock) {
      audioClock.pause()
      audioClock.currentTime = 0
    }


    draftEvent({
      isOpenModalStart: true,
      isActiveTimer: false,
      timerSeconds: 60,
    })

    const newTeamList = [...dataSource]

    newTeamList[activeTeamIndex].players.push({
      ...selectedPlayer,
      isCaptain: false,
    })

    if (activeTeamIndex + 1 >= newTeamList.length) {
      draftEvent({
        config: { ...config, teamList: newTeamList },
        activeTeamIndex: 0,
      })

      return
    }

    draftEvent({
      config: { ...config, teamList: newTeamList },
      activeTeamIndex: activeTeamIndex + 1,
    })
  }

  function onRemovePlayer(playerId: string) {
    const newTeamList = [...dataSource]
    const teamIndex = newTeamList[activeTeamIndex]
    teamIndex.players = teamIndex?.players?.filter((row) => row.id !== playerId)
    draftEvent({ config: { ...config, teamList: newTeamList } })
  }

  useEffect(() => {
    if (!audioStart) return

    if (isOpenModalStart) {
      audioStart.play()
    } else {
      audioStart.pause()
      audioStart.currentTime = 0
    }
  }, [isOpenModalStart])

  useEffect(() => {
    if (!audioClock) return

    if (isActiveTimer) {
      audioClock.volume = 0.3
      audioClock.loop = true
      audioClock.play()
    } else {
      audioClock.loop = false
      audioClock.pause()
      audioClock.currentTime = 0
    }
  }, [isActiveTimer])

  useEffect(() => {
    ; (async () => {
      if (isOpenModalStart) {
        await sleep(4500)
        draftEvent({
          isOpenModalStart: false,
          isActiveTimer: true,
          timerSeconds: 60,
        })
      }
    })()
  }, [isOpenModalStart])

  useEffect(() => {
    const newList = [] as string[]
    const list = config?.teamList ? [...config.teamList] : []
    for (const team of list) {
      for (const player of team.players) {
        newList.push(player.id!)
      }
    }
    setListOfAllocatedPlayers(newList)
  }, [activeTeamIndex, config])

  if (!filteredActiveTeam) return <></>

  return (
    <>
      <AlertDialog
        open={isOpenModalStart}
        onOpenChange={(x) => draftEvent({ isOpenModalStart: x })}
      >
        <AlertDialogContent className="bg-transparent ring-0 border-none shadow-none">
          <LottiePlayer path="/static/animation-start.json" loop={false} />
        </AlertDialogContent>
      </AlertDialog>
      <Card className="w-full p-16">
        <div className="w-full flex items-center justify-center">
          <div className="w-full grid grid-cols-5 gap-4">
            {listRandomPlayers?.map((player, index) => (
              <div
                key={index}
                className="flex items-center justify-center flex-col animate-slide-in"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 animate-slide-in`">
                  <h1 className="text-center font-bold text-3xl text-white">
                    {index + 1}
                  </h1>
                </div>
                <PlayerCard player={player} onSelect={onPlayerSelect} />
              </div>
            ))}
          </div>
        </div>
        <div className="w-full mb-14 mt-6">
          <div className="flex items-center justify-between bg-muted/95 p-2 ring-1">
            <Button
              variant="ghost"
              disabled={activeTeamIndex < 1}
              onClick={() =>
                draftEvent({ activeTeamIndex: activeTeamIndex - 1 })
              }
            >
              <ArrowLeftCircle />
            </Button>
            <span className="font-bold text-zinc-700 text-2xl pl-4">
              Time: {activeTeamIndex + 1}
            </span>
            <Button
              variant="ghost"
              disabled={activeTeamIndex + 1 >= Number(config!.teamsQuantity)}
              onClick={() =>
                draftEvent({ activeTeamIndex: activeTeamIndex + 1 })
              }
            >
              <ArrowRightCircle />
            </Button>
          </div>
          <div className="w-full mt-1">
            <DataTable
              isHidePagination
              data={filteredActiveTeam?.players || []}
              isHideFilterButton
              isLoading={false}
              pageSize={5}
              totalPages={1}
              currentPage={1}
              columns={[
                {
                  id: 'photo',
                  helperName: 'Foto',
                  accessorKey: 'Foto',
                  cell: ({ row }: { row: { original: IPlayer } }) => {
                    return (
                      <Avatar>
                        <AvatarImage src={row.original.photo} />
                        <AvatarFallback>
                          {row.original.name?.substring(0, 2)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )
                  },
                },
                {
                  id: 'name',
                  helperName: 'Nome',
                  accessorKey: 'Nome',
                  cell: ({ row }: { row: { original: IPlayer } }) => {
                    return (
                      <div className="w-[350px] text-md flex gap-4 shrink-0">
                        <div className="flex flex-col shrink-0">
                          <b className="shrink-0">
                            {row.original?.name?.toUpperCase()}
                          </b>
                          <small>{row.original?.nick}</small>
                        </div>
                        {row.original?.isCaptain && (
                          <div className="text-white text-sm text-center pt-[2px] rounded-full w-[80px] h-[24px] bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 ">
                            &nbsp;Capitão&nbsp;
                          </div>
                        )}
                      </div>
                    )
                  },
                },
                {
                  id: 'medal',
                  accessorKey: 'medal',
                  helperName: 'Medalhas',
                  header: 'Medalhas',
                  cell: ({ row }: { row: { original: IPlayer } }) => {
                    const value = row.original?.medal
                    return (
                      <div className="flex items-center gap-2">
                        <Medal className="text-yellow-400 w-6 h-6" />
                        <b className="text-lg">{value}</b>
                      </div>
                    )
                  },
                },
                {
                  id: 'wins',
                  helperName: 'Wins',
                  accessorKey: 'Wins',
                  header: 'Vitórias',
                  cell: ({ row }: { row: { original: IPlayer } }) => {
                    const wins = row.original?.wins
                    return (
                      <div className="flex items-center gap-2">
                        <Trophy className="text-yellow-400 w-6 h-6" />
                        <b className="text-lg">{wins}</b>
                      </div>
                    )
                  },
                },
                {
                  id: 'stars',
                  helperName: 'Stars',
                  accessorKey: 'Stars',
                  header: 'Estrelas',
                  cell: ({ row }: { row: { original: IPlayer } }) => {
                    const stars = row.original?.stars
                    return (
                      <div className="flex items-center gap-2">
                        <Star className="text-yellow-400 w-6 h-6" />
                        <b className="text-lg">{stars}</b>
                      </div>
                    )
                  },
                },
                {
                  id: 'actions',
                  helperName: '',
                  accessorKey: '',
                  cell: ({ row }: { row: { original: IPlayer } }) => {
                    return (
                      <Button
                        disabled={row.original.isCaptain}
                        variant="outline"
                        onClick={() => onRemovePlayer(row.original.id!)}
                      >
                        <Trash2 className="text-red-500" />
                      </Button>
                    )
                  },
                },
              ]}
            />
          </div>
        </div>
        <div className="w-full flex justify-center mt-20 gap-8">
          <Button
            variant="outline"
            onClick={() => draftEvent({ activeTab: '1' })}
            className="min-w-[300px]  py-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={() => draftEvent({ activeTab: '3' })}
            className="min-w-[300px] bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600  py-2"
          >
            Próximo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </Card>
    </>
  )
}

export default PlayersSelect
