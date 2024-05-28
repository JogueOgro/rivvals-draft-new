import { useStore } from 'effector-react'
import { Medal, Star, Trophy, X } from 'lucide-react'
import React, { useEffect } from 'react'

import DataTable from '@/components/data-table'
import HeadMetatags from '@/components/head-metatags'
import PlayerActions from '@/components/player-actions'
import PopoverTag from '@/components/popover-tag'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { IPlayer } from '@/domain/player.domain'
import { playerEvent } from '@/store/player/player-events'
import playerStore from '@/store/player/player-store'
import { removeTagUseCase } from '@/useCases/draft/remove-tag.useCase'

import TableFilters from './table-filters'

const PlayerPage = () => {
  const {
    currentPage,
    totalPages,
    pageSize,
    players,
    isLoading,
    filters,
    totalRegistries,
  } = useStore(playerStore)

  const searchText = filters?.name?.trim()?.toLowerCase() || ''
  const filteredData = [...players]?.filter((obj) =>
    obj?.name?.trim()?.toLowerCase().includes(searchText),
  )
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentPageData = filteredData?.slice(startIndex, endIndex)

  useEffect(() => {
    const totalPages = Math.ceil(totalRegistries / pageSize)
    playerEvent({ totalPages })
  }, [pageSize, totalRegistries])

  useEffect(() => {
    playerEvent({
      filters: { name: '' },
      selectedRows: [],
      currentPage: 1,
      pageSize: 10,
    })
  }, [])

  return (
    <>
      <HeadMetatags title="Players" />
      <div>
        <div className="flex items-center justify-between flex-col sm:flex-row gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">Players</span>
              {!!players?.length && (
                <Badge className="text-lg bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 ">
                  {players.length}
                </Badge>
              )}
            </div>
            <span className="text-lg font-light pt-2">
              Gestão de jogadores do campeonato
            </span>
          </div>
        </div>
        <div className="w-full rounded-md mt-4">
          <DataTable
            data={currentPageData}
            isHideFilterButton
            pageSize={pageSize}
            isLoading={isLoading}
            totalPages={totalPages}
            currentPage={currentPage}
            customTableHeader={<TableFilters />}
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
                    <div>
                      <span className="font-semibold flex flex-col">
                        {row.original?.name?.toUpperCase()}
                      </span>
                      <small>{row.original?.nick}</small>
                    </div>
                  )
                },
              },
              {
                id: 'team',
                helperName: 'Time',
                accessorKey: 'Time',
                cell: ({ row }: { row: { original: IPlayer } }) =>
                  row.original.team || '-',
              },
              {
                id: 'twitch',
                helperName: 'Twitch',
                accessorKey: 'Twitch',
                cell: ({ row }: { row: { original: IPlayer } }) => {
                  return (
                    <div>
                      <span className="font-semibold flex flex-col">
                        {row.original?.twitch || '-'}
                      </span>
                    </div>
                  )
                },
              },
              {
                id: 'tags',
                helperName: 'Tags',
                accessorKey: 'Tags',
                cell: ({ row }: { row: { original: IPlayer } }) => {
                  const tags = row.original?.tags?.trim() || ''
                  const listTags = tags?.split(',')
                  if (!tags) return <PopoverTag playerId={row.original.id} />

                  return (
                    <div className="flex w-fit items-center gap-1">
                      {listTags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="w-fit flex items-center justify-between gap-1"
                        >
                          {tag}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() =>
                              removeTagUseCase.execute({
                                tag,
                                playerId: row.original.id,
                              })
                            }
                          />
                        </Badge>
                      ))}
                      <PopoverTag playerId={row.original.id} />
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
                id: 'status',
                accessorFn: () => '',
                header: () => '',
                helperName: 'Status',
                cell: ({ row }: { row: { original: IPlayer } }) => {
                  return row.original.isExcluded ? (
                    <Badge className="bg-red-600">Desistente</Badge>
                  ) : (
                    <Badge className="bg-green-600">Ativo</Badge>
                  )
                },
              },
              {
                id: 'actions',
                accessorFn: () => '',
                header: () => '',
                helperName: 'Opções',
                cell: ({ row }: { row: { original: IPlayer } }) => {
                  return <PlayerActions row={row} data={players} />
                },
              },
            ]}
            onChangePageSize={(pageSize) => {
              playerEvent({ pageSize })
            }}
            onChangeCurrentPage={(currentPage) => {
              playerEvent({ currentPage })
            }}
          />
        </div>
      </div>
    </>
  )
}

export default PlayerPage
