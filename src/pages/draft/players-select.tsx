import { useStore } from 'effector-react';
import React, { useEffect, useState } from 'react';
import playerStore from '@/store/player/player-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { draftEvent } from '@/store/draft/draft-events';
import { ArrowLeft, ArrowLeftCircle, ArrowRight, ArrowRightCircle, Trash2, Trophy } from 'lucide-react';
import DataTable from '@/components/data-table';
import TimerClock from '@/components/timer';
import { ITeam } from '@/domain/draft.domain';
import draftStore from '@/store/draft/draft-store';
import { StarFilledIcon } from '@radix-ui/react-icons';
import PlayerCard from '@/components/card-player';
import { IPlayer } from '@/domain/player.domain';

const PlayersSelect = () => {
  const { config, activeTeamIndex } = useStore(draftStore)
  const { players } = useStore(playerStore)
  const [listOfAllocatedPlayers, setListOfAllocatedPlayers] = useState<string[]>([])

  const filteredActiveTeam = [...config!.teamList]?.filter((_, index) => {
    return index === activeTeamIndex
  });

  const filteredAvailablePlayers = [...players]?.filter(player => {
    return !listOfAllocatedPlayers.includes(player.id!)
  })

  const sortPlayersByScore = filteredAvailablePlayers?.sort((playerA, playerB) => {
    return Number(playerB?.score) - Number(playerA?.score)
  });

  const top5Players = sortPlayersByScore?.slice(0, 5)

  function onPlayerSelect(selectedPlayer: IPlayer) {
    const newTeamList = [...config!.teamList];
    newTeamList[activeTeamIndex].players.push({ ...selectedPlayer, isCaptain: false })

    if (activeTeamIndex + 1 >= newTeamList.length) {
      draftEvent({ config: { ...config, teamList: newTeamList }, activeTeamIndex: 0 })
    } else {
      draftEvent({ config: { ...config, teamList: newTeamList }, activeTeamIndex: activeTeamIndex + 1 })
    }
  }

  function onRemovePlayer(playerId: string) {
    const newTeamList = [...config!.teamList]
    const teamIndex = newTeamList[activeTeamIndex]
    teamIndex.players = teamIndex?.players?.filter(row => row.id !== playerId);
    draftEvent({ config: { ...config, teamList: newTeamList } })
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

  if (!filteredActiveTeam) return <></>


  return (
    <>
      <TimerClock />
      <Card className="w-full p-16">
        <div className="grid grid-cols-5 gap-2 mb-4">
          {top5Players?.map(player => (
            <PlayerCard player={player} onSelect={player => onPlayerSelect(player)} />
          ))}
        </div>

        {filteredActiveTeam?.map((team: ITeam) => {
          return (
            <div className="w-full mb-14 mt-2">
              <div className="flex items-center justify-between bg-muted/95 p-2 ring-1">
                <Button
                  variant='ghost'
                  disabled={activeTeamIndex < 1}
                  onClick={() => draftEvent({ activeTeamIndex: activeTeamIndex - 1 })}
                >
                  <ArrowLeftCircle />
                </Button>
                <span className="font-bold text-zinc-700 text-2xl pl-4">{team?.name}</span>
                <Button
                  variant='ghost'
                  disabled={activeTeamIndex + 1 >= Number(config!.teamsQuantity)}
                  onClick={() => draftEvent({ activeTeamIndex: activeTeamIndex + 1 })}
                >
                  <ArrowRightCircle />
                </Button>
              </div>
              <div className="w-full mt-1">
                <DataTable
                  isHidePagination
                  data={team?.players || []}
                  isHideFilterButton
                  isLoading={false}
                  pageSize={1}
                  totalPages={1}
                  currentPage={1}
                  columns={[
                    {
                      id: 'name',
                      helperName: 'Nome',
                      accessorKey: 'Nome',
                      cell: ({ row }: { row: { original: IPlayer } }) => {
                        return (
                          <div className="w-[350px] text-md flex gap-4 shrink-0">
                            <div className="flex flex-col shrink-0">
                              <b className="shrink-0">{row.original?.name?.toUpperCase()}</b>
                              <small>{row.original?.nick}</small>
                            </div>
                            {row.original?.isCaptain && (
                              <div className="text-white text-sm text-center pt-[2px] rounded-full w-[80px] h-[24px] bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 hover:to-purple-900">
                                Capitão
                              </div>
                            )}
                          </div>
                        );
                      },
                    },
                    {
                      id: 'score',
                      helperName: 'Score',
                      accessorKey: 'Score',
                      cell: ({ row }: { row: { original: IPlayer } }) => {
                        return <div className="w-[50px]">{row.original?.score}</div>;
                      },
                    },
                    {
                      id: 'wins',
                      helperName: 'Wins',
                      accessorKey: 'Wins',
                      cell: ({ row }: { row: { original: IPlayer } }) => {
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
                      cell: ({ row }: { row: { original: IPlayer } }) => {
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
                      helperName: '',
                      accessorKey: '',
                      cell: ({ row }: { row: { original: IPlayer } }) => {
                        return (
                          <Button disabled={row.original.isCaptain} variant='outline' onClick={() => onRemovePlayer(row.original.id!)}>
                            <Trash2 className="text-red-500" />
                          </Button>
                        );
                      },
                    },
                  ]}
                  onChangePageSize={() => { }}
                  onChangeCurrentPage={() => { }}
                />
              </div>



            </div>
          )
        })}

        <div className="w-full flex justify-center mt-20 gap-8">
          <Button
            variant='outline'
            onClick={() => draftEvent({ activeTab: '2' })}
            className="min-w-[300px]  py-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={() => draftEvent({ activeTab: '4' })}
            className="min-w-[300px] bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 hover:to-purple-900 py-2"
          >
            Próximo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </Card>
    </>
  );
}

export default PlayersSelect;