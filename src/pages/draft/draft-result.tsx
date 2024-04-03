import { useStore } from 'effector-react';
import React, { } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { draftEvent } from '@/store/draft/draft-events';
import { ArrowLeft, ArrowLeftCircle, ArrowRightCircle, Edit, Share, Share2, Trash2, Trophy } from 'lucide-react';
import DataTable from '@/components/data-table';
import draftStore from '@/store/draft/draft-store';
import { StarFilledIcon } from '@radix-ui/react-icons';
import { IPlayer } from '@/domain/player.domain';

const DraftResult = () => {
  const { config, activeTeamIndex } = useStore(draftStore)

  const dataSource = [...config!.teamList];

  const calculatedListWithTeamAvgScore = config?.teamList?.map(team => {
    const teamScore = [...team.players].reduce((total, player) => {
      return total + (player ? Number(player.score) : 0);
    }, 0)
    const avgScore = Math.round(teamScore / team?.players.length)
    return { ...team, avgScore }
  });

  const filteredActiveTeam = [...dataSource]?.find((_, index) => {
    return index === activeTeamIndex
  });

  if (!filteredActiveTeam) return <></>

  return (
    <>
      <Card className="w-full p-16">
        {calculatedListWithTeamAvgScore?.map(team => (
          <div key={team.id} className="w-full mb-14 mt-2">
            <div className="flex items-center justify-between rounded-sm h-16 w-full bg-muted/95">
              <Button variant='ghost'>
                <Edit />
                <span className="font-bold text-2xl pl-4">{team?.name}</span>
              </Button>
              <div className="flex flex-col bg-zinc-200 items-center justify-center px-4 mr-2 rounded-lg">
                <span className="font-bold text-2xl">{team?.avgScore}</span>
                <small>score</small>
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
                              &nbsp;Capitão&nbsp;
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
                ]}
                onChangePageSize={() => { }}
                onChangeCurrentPage={() => { }}
              />
            </div>
          </div>
        ))}

        <div className="w-full flex justify-center mt-20 gap-8">
          <Button
            variant='outline'
            onClick={() => draftEvent({ activeTab: '3' })}
            className="min-w-[300px]  py-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <Button
            className="min-w-[300px] bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 hover:to-purple-900 py-2"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Compartilhar
          </Button>
        </div>
      </Card>
    </>
  );
}

export default DraftResult;