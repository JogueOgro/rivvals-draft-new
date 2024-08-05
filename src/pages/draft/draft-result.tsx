import { useUnit } from 'effector-react'
import {
  ArrowLeft,
  DatabaseIcon,
  DownloadCloud,
  Medal,
  Trophy,
} from 'lucide-react'
import React from 'react'

import DataTable from '@/components/data-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { IPlayer } from '@/domain/player.domain'
import { draftEvent } from '@/store/draft/draft-events'
import draftStore from '@/store/draft/draft-store'
import { downloadDraftUseCase } from '@/useCases/draft/download-draft.useCase'
import { persistDraftUseCase } from '@/useCases/draft/persist-draft.useCase'

const DraftResult = () => {
  const { config, activeTeamIndex } = useUnit(draftStore)

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
      <Card className="w-full pb-12">
        {calculatedListWithTeamAvgScore?.map((team) => (
          <div key={team.id} className="w-full mb-14">
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
                        <div className="w-[400px] text-md flex gap-4 shrink-0">
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
          <Button
            className="min-w-[300px] py-2 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
            onClick={downloadDraftUseCase.execute}
          >
            <DownloadCloud className="w-5 h-5 mr-2" />
            Salvar
          </Button>
          <Button
            className="min-w-[300px] py-2 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
            onClick={persistDraftUseCase.execute}
          >
            <DatabaseIcon className="w-5 h-5 mr-2" />
            Inserir no Banco
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default DraftResult
