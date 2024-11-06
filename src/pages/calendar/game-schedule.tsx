import { useUnit } from 'effector-react'
import Image from 'next/image'
import { useState } from 'react'

import vsImg from '@/assets/vs.png'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import draftStore from '@/store/draft/draft-store'
import playerStore from '@/store/player/player-store'

const weekDays = [
  'SEGUNDA-FEIRA',
  'TERÇA-FEIRA',
  'QUARTA-FEIRA',
  'QUINTA-FEIRA',
  'SEXTA-FEIRA',
  'SABADO',
  'DOMINGO',
]

export default function GameSchedule() {
  const { config } = useUnit(draftStore)
  const { players } = useUnit(playerStore)
  const [selectedTeamA, setSelectedTeamA] = useState('')
  const [selectedTeamB, setSelectedTeamB] = useState('')

  const dataSource = config?.teamList ? [...config.teamList] : []

  const teamA = dataSource
    ?.find((x) => x.id === selectedTeamA)
    ?.players?.map((x) => x.id)

  const teamB = dataSource
    ?.find((x) => x.id === selectedTeamB)
    ?.players?.map((x) => x.id)

  const playersTeamA = [...players]?.filter((x) => teamA?.includes(x.id))
  const playersTeamB = [...players]?.filter((x) => teamB?.includes(x.id))

  return (
    <Card className="p-8 -mt-2">
      <label className="font-semibold">Selecione os times:</label>
      <div className="flex items-center gap-4 mt-6">
        <Select value={selectedTeamA} onValueChange={setSelectedTeamA}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="-Selecione-" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {dataSource?.map((team) => (
                <SelectItem key={team.id} value={team.id!}>
                  Time:{' '}
                  <b>
                    ({team.id}) {team.name}
                  </b>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Image src={vsImg} alt="vs" width={40} height={0} priority />
        <Select value={selectedTeamB} onValueChange={setSelectedTeamB}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="-Selecione-" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {dataSource?.map((team) => (
                <SelectItem key={team.id} value={team.id!}>
                  Time: <b>{team.id}</b>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {!!selectedTeamA && !!selectedTeamB ? (
        <Table className="mt-8">
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Horário</TableHead>
              {weekDays.map((day) => (
                <TableHead key={day}>{day}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[19, 20, 21, 22].map((hour) => (
              <TableRow key={hour}>
                <TableCell className="border">
                  <span className="text-xl">{hour}:00 horas</span>
                </TableCell>
                {weekDays.map((day) => {
                  const scheduleTeamA = playersTeamA?.filter((x) =>
                    x.schedule?.some((y) => y.day === day && y.hour === hour),
                  )
                  const scheduleTeamB = playersTeamB?.filter((x) =>
                    x.schedule?.some((y) => y.day === day && y.hour === hour),
                  )
                  const filteredPlayers = [...scheduleTeamA, ...scheduleTeamB]
                  return (
                    <TableCell
                      key={day}
                      className={
                        !filteredPlayers.length ? 'bg-green-400' : 'bg-red-400'
                      }
                    >
                      <div className="flex flex-col">
                        <span className="text-xl">
                          ({filteredPlayers.length})
                        </span>
                        {filteredPlayers?.map((x) => (
                          <span key={x.id}>{x.name?.split(' ')[0]}</span>
                        ))}
                      </div>
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="p-8 border mt-4">
          Selecione os times para continuar...
        </div>
      )}
    </Card>
  )
}
