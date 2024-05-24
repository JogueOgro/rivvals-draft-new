import { useStore } from 'effector-react'
import {
  ArrowRight,
  ArrowRightLeft,
  Check,
  Medal,
  Star,
  Trophy,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

import DataTable from '@/components/data-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { toast } from '@/components/ui/use-toast'
import { ITeam } from '@/domain/draft.domain'
import { IPlayer } from '@/domain/player.domain'
import { draftEvent } from '@/store/draft/draft-events'
import draftStore from '@/store/draft/draft-store'
import playerStore from '@/store/player/player-store'

import { addSeconds } from 'date-fns'

const CaptainSelection = () => {
  const { config } = useStore(draftStore)
  const { players } = useStore(playerStore)

  const [openDrawer, setOpenDrawer] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null)
  const [listOfAllocatedPlayers, setListOfAllocatedPlayers] = useState<
    string[]
  >([])

  const filteredAvailablePlayers = [...players]?.filter(
    (player) => !listOfAllocatedPlayers.includes(player.id!),
  )

  const filteredSearchPlayers = filteredAvailablePlayers?.filter((player) =>
    player?.name?.toLowerCase().match(searchText.toLowerCase()),
  )

  const sortPlayersByScore = filteredSearchPlayers?.sort((playerA, playerB) => {
    return Number(playerB?.stars) - Number(playerA?.stars)
  })

  function resetStates() {
    setSelectedTeam(null)
    setSearchText('')
    setOpenDrawer(false)
  }

  function handleNext() {
    const list = config?.teamList ? [...config.teamList] : []
    const calculateTeamAvgScore = list.map((team) => {
      const totalScore = [...team.players].reduce((total, player) => {
        return total + (player ? Number(player.stars) : 0)
      }, 0)
      const avgScore = Math.abs(totalScore / team?.players.length)

      return { ...team, avgScore }
    })

    const sortTeamByScore = calculateTeamAvgScore?.sort(
      (teamA, teamB) => teamA.avgScore - teamB.avgScore,
    )

    draftEvent({
      activeTab: '2',
      isOpenModalStart: true,
      timerSeconds: 60,
      activeTeamIndex: 0,
      activeTeamStartTurnDate: new Date(),
      activeTeamEndTurnDate: addSeconds(new Date(), 60),
      config: { ...config, teamList: sortTeamByScore || [] },
    })
  }

  function changeCaptain(newCaptain: IPlayer) {
    const list = config?.teamList ? [...config.teamList] : []
    const newTeamList: ITeam[] = list.map((team) => {
      if (team.id === selectedTeam?.id) {
        return { ...team, players: [{ ...newCaptain, isCaptain: true }] }
      } else {
        return team
      }
    })

    draftEvent({
      config: {
        ...config,
        teamList: newTeamList,
      },
    })

    resetStates()

    toast({
      description: 'Capitão alterado com sucesso',
      title: (
        <div className="flex items-center text-green-700">
          <Check />
          <span className="pl-2 text-bold">Sucesso</span>
        </div>
      ) as never,
    })
  }

  useEffect(() => {
    const newList: string[] = []
    const list = config?.teamList ? [...config.teamList] : []
    for (const team of list) {
      for (const player of team.players) {
        newList.push(player.id!)
      }
    }

    setListOfAllocatedPlayers(newList)
  }, [config])

  return (
    <>
      <Card className="w-full pb-12">
        {config?.teamList?.map((team: ITeam, i) => {
          return (
            <div className="w-full mb-14" key={team.id}>
              <div className="flex items-center rounded-sm h-16 w-full bg-muted/95 ">
                <span className="font-bold text-zinc-700 text-2xl pl-4">
                  Time {i + 1}
                </span>
              </div>
              <DataTable
                isHidePagination
                data={team?.players?.filter((row) => row?.isCaptain) || []}
                isHideFilterButton
                isLoading={false}
                pageSize={1}
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
                    helperName: 'Capitão',
                    accessorKey: 'Capitão',
                    cell: ({ row }: { row: { original: IPlayer } }) => {
                      return (
                        <div className="w-[350px] text-md flex flex-col">
                          <b className="shrink-0">
                            {row.original?.name?.toUpperCase()}
                          </b>
                          <small>{row.original?.nick}</small>
                        </div>
                      )
                    },
                  },
                  {
                    id: 'twitch',
                    helperName: 'Twitch',
                    accessorKey: 'Twitch',
                    cell: ({ row }: { row: { original: IPlayer } }) => {
                      return (
                        <div className="text-md flex flex-col">
                          <b className="shrink-0">{row.original?.twitch}</b>
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
                      const fixedStars = Number(stars) > 3 ? stars : 3
                      return (
                        <div className="flex items-center gap-2">
                          <Star className="text-yellow-400 w-6 h-6" />
                          <b className="text-lg">{fixedStars}</b>
                        </div>
                      )
                    },
                  },
                  {
                    id: 'actions',
                    accessorFn: () => '',
                    header: () => '',
                    helperName: 'Opções',
                    cell: () => {
                      return (
                        <Button
                          onClick={() => {
                            setOpenDrawer((oldValue) => !oldValue)
                            setSelectedTeam(team)
                          }}
                          className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 "
                        >
                          <ArrowRightLeft />
                          &nbsp; Substituir
                        </Button>
                      )
                    },
                  },
                ]}
              />
            </div>
          )
        })}

        <div className="w-full flex justify-center mt-20 gap-8">
          <Button
            onClick={() => handleNext()}
            className="min-w-[300px] bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600  py-2"
          >
            Próximo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </Card>

      <Sheet open={openDrawer} onOpenChange={setOpenDrawer}>
        <SheetContent className="min-w-[750px]">
          <SheetHeader>
            <SheetTitle>
              Substituir capitão do time {selectedTeam?.id}
            </SheetTitle>
            <SheetDescription>
              Selecione abaixo o player desejado
            </SheetDescription>
          </SheetHeader>
          <div className="w-full flex justify-between items-center mt-8">
            <Input
              placeholder="Pesquisar..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="w-[400px]"
            />
            <small className="shrink-0 mr-8">
              Total:
              <b className="pl-1">{filteredAvailablePlayers?.length}</b>
            </small>
          </div>

          <div className="w-full overflow-auto max-h-[88%] pr-4 mt-2">
            {sortPlayersByScore?.map((row) => (
              <Card
                onClick={() => changeCaptain(row)}
                key={row.id}
                className="w-full flex items-center justify-between p-2 rounded-lg shadow-sm my-2 cursor-pointer hover:bg-muted"
              >
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={row.photo} />
                    <AvatarFallback>
                      {row.name?.substring(0, 2)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-bold">{row.name}</span>
                  <span className="font-light">{row.nick}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400 w-6 h-6" />
                  <b className="text-lg">
                    {Number(row.stars) > 3 ? row.stars : 3}
                  </b>
                </div>
              </Card>
            ))}
          </div>
          <div className="min-h-52" />
        </SheetContent>
      </Sheet>
    </>
  )
}

export default CaptainSelection
