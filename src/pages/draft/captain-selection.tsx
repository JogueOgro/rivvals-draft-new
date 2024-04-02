import React, { useEffect, useState } from 'react';
import DataTable from '@/components/data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, ArrowRight, ArrowRightLeft, Check, Edit, Trophy } from 'lucide-react';
import { StarFilledIcon } from '@radix-ui/react-icons';
import { useStore } from 'effector-react';
import draftStore from '@/store/draft/draft-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import playerStore from '@/store/player/player-store';
import { Input } from '@/components/ui/input';
import { IPlayer } from '@/domain/player.domain';
import { ITeam } from '@/domain/draft.domain';
import { draftEvent } from '@/store/draft/draft-events';
import { toast } from '@/components/ui/use-toast';

const CaptainSelection = () => {
  const { config, activeTeamIndex } = useStore(draftStore)
  const { players } = useStore(playerStore)

  const [openDrawer, setOpenDrawer] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null)
  const [listOfAllocatedPlayers, setListOfAllocatedPlayers] = useState<string[]>([])

  const filteredAvailablePlayers = [...players]?.filter(player => !listOfAllocatedPlayers.includes(player.id!))

  const filteredSearchPlayers = filteredAvailablePlayers?.filter(player =>
    player?.name?.toLowerCase().match(searchText.toLowerCase())
  );

  const sortPlayersByScore = filteredSearchPlayers?.sort((playerA, playerB) => {
    return Number(playerB?.score) - Number(playerA?.score)
  });

  function resetStates() {
    setSelectedTeam(null)
    setSearchText('')
    setOpenDrawer(false)
  }

  function changeCaptain(newCaptain: IPlayer) {
    const newTeamList: ITeam[] = [...config!.teamList].map(team => {
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
      }
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
    });
  }

  useEffect(() => {
    const newList: string[] = [];

    for (const team of config!.teamList) {
      for (const player of team.players) {
        newList.push(player.id!)
      }
    }

    setListOfAllocatedPlayers(newList)
  }, [config?.teamList])


  return (
    <>
      <Card className="w-full pb-12">
        {config?.teamList?.map((team: ITeam) => {
          return (
            <div className="w-full mb-14">
              <div className="flex items-center rounded-sm h-16 w-full bg-muted/95 hover:to-purple-900">
                <Button variant='ghost'>
                  <Edit />
                  <span className="font-bold text-zinc-700 text-2xl pl-4">{team?.name}</span>
                </Button>
              </div>
              <DataTable
                isHidePagination
                data={team?.players?.filter(row => row?.isCaptain) || []}
                isHideFilterButton
                isLoading={false}
                pageSize={1}
                totalPages={1}
                currentPage={1}
                columns={[
                  {
                    id: 'name',
                    helperName: 'Capitão',
                    accessorKey: 'Capitão',
                    cell: ({ row }: any) => {
                      return (
                        <div className="w-[350px] text-md flex flex-col">
                          <b className="shrink-0">{row.original?.name?.toUpperCase()}</b>
                          <small>{row.original?.nick}</small>
                        </div>
                      );
                    },
                  },
                  {
                    id: 'score',
                    helperName: 'Score',
                    accessorKey: 'Score',
                    cell: ({ row }: any) => {
                      return <div className="w-[50px]">{row.original?.score}</div>;
                    },
                  },
                  {
                    id: 'wins',
                    helperName: 'Wins',
                    accessorKey: 'Wins',
                    cell: ({ row }: any) => {
                      const wins = row.original?.wins
                      const Icons = () => {
                        return new Array(wins).fill('').map(() => (
                          <Trophy className="text-yellow-400 w-6 h-6" />
                        ))
                      }
                      return <div className="w-[150px] flex items-center"><Icons /></div>;
                    },
                  },
                  {
                    id: 'power',
                    helperName: 'Power',
                    accessorKey: 'Power',
                    cell: ({ row }: any) => {
                      const power = row.original?.power
                      const Stars = () => {
                        return new Array(power).fill('').map(() => (
                          <StarFilledIcon className="text-yellow-400 w-6 h-6" />
                        ))
                      }
                      return <div className="flex items-center w-[150px]"><Stars /></div>;
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
                            setOpenDrawer(oldValue => !oldValue)
                            setSelectedTeam(team)
                          }}
                          className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 hover:to-purple-900"
                        >
                          <ArrowRightLeft />
                          &nbsp;
                          Substituir
                        </Button>
                      )
                    },
                  },
                ]}
                onChangePageSize={() => { }}
                onChangeCurrentPage={() => { }}
              />
            </div>
          )
        })}

        <div className="w-full flex justify-center mt-20 gap-8">
          <Button
            variant='outline'
            onClick={() => draftEvent({ activeTab: '1' })}
            className="min-w-[300px]  py-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={() => {
              draftEvent({
                activeTab: '3',
                isActiveTimer: true,
                timerSeconds: 60,
                activeTeamIndex: 0
              })
            }}
            className="min-w-[300px] bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 hover:to-purple-900 py-2"
          >
            Próximo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

      </Card>

      <Sheet open={openDrawer} onOpenChange={setOpenDrawer}>
        <SheetContent className="min-w-[750px]">
          <SheetHeader>
            <SheetTitle>Substituir capitão do time {selectedTeam?.id}</SheetTitle>
            <SheetDescription>
              Selecione abaixo o player desejado
            </SheetDescription>
          </SheetHeader>
          <div className="w-full flex justify-between items-center mt-8">
            <Input
              placeholder="Pesquisar..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className='w-[400px]'
            />
            <small className='shrink-0 mr-8'>
              Total:
              <b className="pl-1">{filteredAvailablePlayers?.length}</b>
            </small>
          </div>

          <div className="w-full overflow-auto max-h-[88%] pr-4 mt-2">
            {sortPlayersByScore?.map(row => (
              <Card
                onClick={() => changeCaptain(row)}
                key={row.id}
                className="w-full flex items-center justify-between p-2 rounded-lg shadow-sm my-2 cursor-pointer hover:bg-muted"
              >
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={row.photo} />
                    <AvatarFallback>{row.name?.substring(0, 2)?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="font-bold">{row.name}</span>
                  <span className="font-light">{row.nick}</span>
                </div>
                <span className="font-bold text-lg">{row.score}</span>
              </Card>
            ))}
          </div>
          <div className="min-h-52" />
        </SheetContent>
      </Sheet>
    </>
  );
}

export default CaptainSelection;