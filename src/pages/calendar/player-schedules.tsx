/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable prettier/prettier */
import { useUnit } from 'effector-react'
import { DatabaseIcon, DownloadCloud } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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
import { sortDays } from '@/lib/utils'
import draftStore from '@/store/draft/draft-store'
import { playerEvent } from '@/store/player/player-events'
import playerStore from '@/store/player/player-store'
import { downloadDraftUseCase } from '@/useCases/draft/download-draft.useCase'
import { persistDraftUseCase } from '@/useCases/draft/persist-draft.useCase'
import { persistNewDraftUseCase } from '@/useCases/draft/persist-new-draft.useCase'

const weekDays = [
  'SEGUNDA-FEIRA',
  'TERÇA-FEIRA',
  'QUARTA-FEIRA',
  'QUINTA-FEIRA',
  'SEXTA-FEIRA',
  'SABADO',
  'DOMINGO',
]

export default function PlayerSchedules() {
  const { config } = useUnit(draftStore)
  const { players } = useUnit(playerStore)

  return (
    <Card className="p-8 -mt-2">
      <Button
        className="min-w-[300px] py-2 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
        onClick={downloadDraftUseCase.execute}
      >
        <DownloadCloud className="w-5 h-5 mr-2" />
        Salvar
      </Button>
      <span>&nbsp;&nbsp;</span>
      <Button
        className="min-w-[300px] py-2 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
        onClick={persistDraftUseCase.execute}
      >
        <DatabaseIcon className="w-5 h-5 mr-2" />
        Inserir no Banco
      </Button>
      <span>&nbsp;&nbsp;</span>
      {/* <Button
        className="min-w-[300px] py-2 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
        onClick={persistNewDraftUseCase.execute}
      >
        <DatabaseIcon className="w-5 h-5 mr-2" />
        Salvar novo Draft
      </Button> */}
      {Array.from({ length: Number(config?.teamsQuantity || 0) })?.map(
        (_, idx) => (
          <Table className="my-4 border-t " key={idx}>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>Player</TableHead>
                <TableHead>Time</TableHead>
                {weekDays.map((day) => (
                  <TableHead key={day}>{day}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {players
                ?.sort((a, b) => Number(a.team) - Number(b.team))
                ?.filter((player) => Number(player.team) === idx + 1)
                ?.map((player, playerIndex) => (
                  <TableRow
                    key={player.id}
                    className={`${Number(playerIndex) % 2 ? 'bg-muted' : ''}`}
                  >
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
                    <TableCell className="font-bold text-1xl">
                      {player.team}
                    </TableCell>
                    {weekDays.map((day) => (
                      <TableCell key={'day' + day}>
                        <div className="flex items-center gap-1">
                          {[19, 20, 21, 22].map((hour) => {
                            const key = `${day}_${hour}`

                            const isChecked = [...players]
                              ?.find((x) => x.idplayer === player.idplayer)
                              ?.schedule?.some((x) => {
                                const checkKey = `${x.day}_${x.hour}`
                                return checkKey === key
                              })

                            return (
                              <div
                                className="flex items-center space-x-0.5"
                                key={'hour' + key}
                              >
                                <Checkbox
                                  id={`${player.id}_${day}_${hour}`}
                                  checked={isChecked}
                                  onCheckedChange={(v) => {
                                    if (v) {
                                      const newList =
                                        [...players]?.find(
                                          (x) => x.id === player.id,
                                        )?.schedule || []
                                      newList.push({ day, hour })
                                      playerEvent({
                                        players: [...players]?.map((x) =>
                                          x.id === player.id
                                            ? {
                                                ...x,
                                                schedule:
                                                  newList.sort(sortDays),
                                              }
                                            : x,
                                        ),
                                      })
                                    } else {
                                      const newList =
                                        [...players]?.find(
                                          (x) => x.id === player.id,
                                        )?.schedule || []
                                      const filteredList = [...newList].filter(
                                        (x) => {
                                          const checkKey = `${x.day}_${x.hour}`
                                          return key !== checkKey
                                        },
                                      )
                                      playerEvent({
                                        players: [...players]?.map((x) =>
                                          x.id === player.id
                                            ? {
                                                ...x,
                                                schedule:
                                                  filteredList.sort(sortDays),
                                              }
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
        ),
      )}
    </Card>
  )
}
