import { useStore } from 'effector-react'
import { ArrowLeft, Eye, EyeOff, Medal, Star, Trophy } from 'lucide-react'
import React, { useState } from 'react'

import DataTable from '@/components/data-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { IPlayer } from '@/domain/player.domain'
import { draftEvent } from '@/store/draft/draft-events'
import draftStore from '@/store/draft/draft-store'

const DraftResult = () => {
  const [isShowScore, setIsShowScore] = useState(false)
  const { config, activeTeamIndex } = useStore(draftStore)

  const dataSource = config?.teamList ? [...config.teamList] : []

  const calculatedListWithTeamAvgScore = config?.teamList?.map((team) => {
    const teamScore = [...team.players].reduce((total, player) => {
      return total + (player ? Number(player.stars) : 0)
    }, 0)
    const avgScore = Math.abs(teamScore / team?.players.length)
    return { ...team, avgScore }
  })

  const filteredActiveTeam = [...dataSource]?.find((_, index) => {
    return index === activeTeamIndex
  })

  if (!filteredActiveTeam) return <></>

  return (
    <div className="relative">
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-0 -top-10 text-zinc-500"
        onClick={() => setIsShowScore((x) => !x)}
      >
        {isShowScore ? <EyeOff /> : <Eye />}
      </Button>
      <Card className="w-full pb-12">
        {calculatedListWithTeamAvgScore?.map((team, i) => (
          <div key={team.id} className="w-full mb-14">
            <div className="flex items-center justify-between rounded-sm h-16 w-full bg-muted/95">
              <span className="font-bold text-2xl pl-4">Time {i + 1}</span>
              <div
                className={`flex flex-col bg-muted-foreground/10 border items-center justify-center px-4 mr-2 rounded-lg ${isShowScore ? '' : 'blur-sm'}`}
              >
                <span className="font-bold text-2xl">
                  {team?.avgScore.toFixed(1)}
                </span>
                <small>média</small>
              </div>
            </div>
            <div className="w-full mt-1">
              <DataTable
                isHidePagination
                data={team?.players || []}
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
                      const fixedStars = Number(stars) > 3 ? stars : 3
                      return (
                        <div className="flex items-center gap-2">
                          <Star className="text-yellow-400 w-6 h-6" />
                          <b className="text-lg">{fixedStars}</b>
                        </div>
                      )
                    },
                  },
                ]}
              />
            </div>
          </div>
        ))}

        <div className="w-full flex justify-center mt-20 gap-8">
          <Button
            variant="outline"
            onClick={() => draftEvent({ activeTab: '2' })}
            className="min-w-[300px]  py-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default DraftResult
