import { StarFilledIcon } from '@radix-ui/react-icons'
import { useStore } from 'effector-react'
import { Check, Trash, Trophy } from 'lucide-react'
import React, { useEffect } from 'react'

import DataTable from '@/components/data-table'
import HeadMetatags from '@/components/head-metatags'
import PageLayout from '@/components/page-layout'
import PlayerActions from '@/components/player-actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/components/ui/use-toast'
import { IPlayer } from '@/domain/player.domain'
import { playerEvent } from '@/store/player/player-events'
import playerStore from '@/store/player/player-store'
import { deletePlayersUseCase } from '@/useCases/player/delete-player.useCase'
import { importPlayersUseCase } from '@/useCases/player/import-players.useCase'

import DownloadButton from './download-button'
import ImportButton from './import-button'
import TableFilters from './table-filters'

const PlayerPage = () => {
  const {
    currentPage,
    totalPages,
    pageSize,
    selectedRows,
    players,
    isLoading,
    filters,
    totalRegistries,
  } = useStore(playerStore)

  const searchText = filters?.name?.trim()?.toLowerCase() || ''
  const filteredData = players?.filter((obj) =>
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
      <PageLayout>
        <div className="flex items-center justify-between flex-col sm:flex-row gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">Players</span>
              {!!players?.length && (
                <Badge className="text-lg bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 hover:to-purple-900">
                  {players.length}
                </Badge>
              )}
            </div>
            <span className="text-lg font-light pt-2">
              Gestão de jogadores do campeonato
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DownloadButton />
            <ImportButton
              onImport={(data) =>
                importPlayersUseCase.execute(data, successCallBack)
              }
            />
            {!!selectedRows.length && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="default"
                    className="ml-2 py-2 bg-gradient-to-r from-red-800 via-red-700 to-red-600 hover:to-red-900"
                  >
                    <div className="w-full flex items-center justify-between space-x-2">
                      <Trash className="w-4" />
                      <span className="text-md">Excluir selecionados</span>
                    </div>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Atenção!</AlertDialogTitle>
                    <AlertDialogDescription>
                      Você tem certeza que deseja excluir os usuários
                      selecionados ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        deletePlayersUseCase.execute(selectedRows)
                      }}
                    >
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
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
                id: 'checkbox',
                accessorKey: '',
                helperName: 'Selecione',
                header: () => {
                  const { selectedRows } = playerStore.getState()
                  const isChecked =
                    players.length > 0 &&
                    players?.every((obj) => selectedRows.includes(obj.id!))
                  const onChange = (checked: boolean) => {
                    if (checked) {
                      playerEvent({
                        selectedRows: [
                          ...selectedRows,
                          ...players?.map((item) => item.id!),
                        ],
                      })
                    } else {
                      playerEvent({ selectedRows: [] })
                    }
                  }
                  return (
                    <>
                      <Checkbox
                        id="table-checkbox"
                        checked={isChecked}
                        onCheckedChange={onChange}
                      />
                    </>
                  )
                },
                cell: ({ row }: { row: { original: IPlayer } }) => {
                  const playerId = row.original.id
                  const { selectedRows } = playerStore.getState()
                  const isChecked = selectedRows?.includes(row.original.id!)
                  const onChange = (checked: boolean) => {
                    if (checked) {
                      playerEvent({
                        selectedRows: [...selectedRows, playerId!],
                      })
                    } else {
                      playerEvent({
                        selectedRows: [...selectedRows].filter(
                          (x) => x !== playerId,
                        ),
                      })
                    }
                  }
                  return (
                    <Checkbox
                      id="table-checkbox"
                      checked={isChecked}
                      onCheckedChange={onChange}
                    />
                  )
                },
              },
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
                    <span className="text-md font-bold">
                      {row.original?.name?.toUpperCase()}
                    </span>
                  )
                },
              },
              {
                id: 'nick',
                helperName: 'Nick',
                accessorKey: 'Nick',
                cell: ({ row }: { row: { original: IPlayer } }) => {
                  return <span>{row.original?.nick}</span>
                },
              },
              {
                id: 'email',
                helperName: 'E-mail',
                accessorKey: 'E-mail',
                cell: ({ row }: { row: { original: IPlayer } }) => {
                  return <span>{row.original?.email}</span>
                },
              },
              {
                id: 'score',
                helperName: 'Score',
                accessorKey: 'Score',
                cell: ({ row }: { row: { original: IPlayer } }) => {
                  return <b>{row.original?.score}</b>
                },
              },
              {
                id: 'wins',
                helperName: 'Wins',
                accessorKey: 'Wins',
                cell: ({ row }: { row: { original: IPlayer } }) => {
                  const wins = row.original?.wins
                  const Icons = () => {
                    return new Array(wins)
                      .fill('')
                      .map((_, i) => (
                        <Trophy key={i} className="text-yellow-400 w-6 h-6" />
                      ))
                  }
                  return (
                    <div className="flex items-center">
                      <Icons />
                    </div>
                  )
                },
              },
              {
                id: 'power',
                helperName: 'Power',
                accessorKey: 'Power',
                cell: ({ row }: { row: { original: IPlayer } }) => {
                  const power = row.original?.power
                  const Stars = () => {
                    return new Array(power)
                      .fill('')
                      .map((_, i) => (
                        <StarFilledIcon
                          key={i}
                          className="text-yellow-400 w-6 h-6"
                        />
                      ))
                  }
                  return (
                    <div className="flex items-center">
                      <Stars />
                    </div>
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
      </PageLayout>
    </>
  )
}

const successCallBack = () => {
  toast({
    description: 'Importação realizada com sucesso',
    title: (
      <div className="flex items-center text-green-700">
        <Check />
        <span className="pl-2 text-bold">Sucesso</span>
      </div>
    ) as never,
  })
}

export default PlayerPage
