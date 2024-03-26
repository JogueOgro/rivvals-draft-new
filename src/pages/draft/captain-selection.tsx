import React from 'react';
import DataTable from '@/components/data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRightLeft, Edit, Trophy } from 'lucide-react';
import { StarFilledIcon } from '@radix-ui/react-icons';
import PlayerActions from '@/components/player-actions';
import { useStore } from 'effector-react';
import draftStore from '@/store/draft/draft-store';
import { Button } from '@/components/ui/button';

const CaptainSelectionTable = () => {
  const { config } = useStore(draftStore)
  return (
    <div className="w-full">
      {config?.teamList?.map(team => {
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
              data={team?.players || []}
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
                  cell: ({ row }: any) => {
                    return (
                      <Avatar>
                        <AvatarImage src={row.original.photo} />
                        <AvatarFallback>{row.original.name?.substring(0, 2)?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )
                  },
                },
                {
                  id: 'name',
                  helperName: 'Nome',
                  accessorKey: 'Nome',
                  cell: ({ row }: any) => {
                    return <div className="w-[250px] font-bold text-md">{row.original?.name?.toUpperCase()}</div>;
                  },
                },
                {
                  id: 'nick',
                  helperName: 'Nick',
                  accessorKey: 'Nick',
                  cell: ({ row }: any) => {
                    return <div className="w-[150px]">{row.original?.nick}</div>;
                  },
                },
                {
                  id: 'email',
                  helperName: 'E-mail',
                  accessorKey: 'E-mail',
                  cell: ({ row }: any) => {
                    return <div className="w-[200px]">{row.original?.email}</div>;
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
                      <Button className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 hover:to-purple-900">
                        <ArrowRightLeft />
                        Substituir
                      </Button>
                    )
                  },
                },
              ]}
              onChangePageSize={(pageSize) => { }}
              onChangeCurrentPage={(currentPage) => { }}
            />
          </div>
        )
      })}

    </div>
  );
}

export default CaptainSelectionTable;