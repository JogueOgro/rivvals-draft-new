import { useStore } from 'effector-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { playerEvent } from '@/store/player/player-events'
import playerStore from '@/store/player/player-store'

const weekDays = [
  'SEGUNDA-FEIRA',
  'TERÇA-FEIRA',
  'QUARTA-FEIRA',
  'QUINTA-FEIRA',
  'SEXTA-FEIRA',
]

export default function PlayerSchedules() {
  const { players } = useStore(playerStore)

  return (
    <Card className="p-8 -mt-2">
      <Table className="mt-2">
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead>Player</TableHead>
            {weekDays.map((day) => (
              <TableHead key={day}>{day}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {players?.map((player) => (
            <TableRow key={player.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={player.photo} />
                    <AvatarFallback>
                      {player.name?.substring(0, 2)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-md flex gap-4 shrink-0">
                    <div className="flex flex-col shrink-0">
                      <b className="shrink-0">
                        {player?.name?.toUpperCase().split(' ')[0]}
                      </b>
                      <small>{player?.nick}</small>
                    </div>
                  </div>
                </div>
              </TableCell>
              {weekDays.map((day) => (
                <TableCell key={day}>
                  <div className="flex items-center gap-1">
                    {[19, 20, 21, 22, 23].map((hour) => {
                      const playerScheduleList =
                        players?.find((x) => x.id === player.id)?.schedule || []

                      const isChecked = playerScheduleList?.some(
                        (x) => x.hour === hour && x.day === day,
                      )

                      return (
                        <div
                          className="flex items-center space-x-0.5"
                          key={hour}
                        >
                          <Checkbox
                            id={`${player.id}_${day}_${hour}`}
                            checked={isChecked}
                            onCheckedChange={(v) => {
                              if (v) {
                                playerScheduleList.push({ day, hour })
                                playerEvent({
                                  players: players?.map((x) =>
                                    x.id === player.id
                                      ? { ...x, schedule: playerScheduleList }
                                      : x,
                                  ),
                                })
                              } else {
                                const newScheduleList =
                                  playerScheduleList?.filter(
                                    (x) => x.day !== day && x.hour !== hour,
                                  )
                                playerEvent({
                                  players: players?.map((x) =>
                                    x.id === player.id
                                      ? { ...x, schedule: newScheduleList }
                                      : x,
                                  ),
                                })
                              }
                            }}
                          />
                          <label
                            htmlFor={`${player.id}_${day}_${hour}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {hour.toString().padStart(2, '0')}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
