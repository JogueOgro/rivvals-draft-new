'use client'

import { ArrowLeft, DatabaseIcon, Loader2, X } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fixStringToObj, sortDays, weekDays } from '@/lib/utils'
import { editPlayerSchedule } from '@/useCases/player/edit-player-schedule.useCase'

export default function CalendarSection(props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [player, setPlayer] = useState(props.player)

  useEffect(() => {
    setIsLoading(false)
    console.log(player.schedule)
    if (!Array.isArray(player.schedule)) {
      player.schedule = fixStringToObj(player.schedule)
    }
  }, [player])

  if (isLoading) {
    return (
      <div className="p-4 flex w-full min-h-screen items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="p-4 flex w-full min-h-screen items-center justify-center">
        <div className="text-center">Jogador não encontrado</div>
      </div>
    )
  }

  return (
    <>
      <div className="p-4 flex w-full min-h-screen items-start justify-center">
        <div className="flex flex-col pb-12 rounded animate-in fade-in shadow-lg transition-all duration-1000 bg-white w-full max-w-[1000px] my-4 backdrop-filter backdrop-blur-lg bg-opacity-40 border-t border-t-gray-200">
          <div className="w-full mt-4 p-4">
            <strong className="text-lg">Marque seus horários ocupados</strong>
            <Table className="my-4 border-t">
              <TableHeader>
                <TableRow className="bg-muted">
                  {weekDays.map((day) => (
                    <TableHead key={day}>{day}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  key={player.idplayer}
                  className={`${Number(player.idplayer) % 2 ? 'bg-muted' : ''}`}
                >
                  {weekDays.map((day) => (
                    <TableCell key={'day' + day}>
                      <div className="flex items-center gap-1">
                        {[19, 20, 21, 22].map((hour) => {
                          const key = `${day}_${hour}`
                          const schedule = player?.schedule || []
                          const isChecked = schedule.some((x) => {
                            const checkKey = `${x.day}_${x.hour}`
                            return checkKey === key
                          })

                          return (
                            <div
                              className="flex items-center space-x-0.5"
                              key={'hour' + key}
                            >
                              <Checkbox
                                id={`${player.idplayer}_${day}_${hour}`}
                                checked={isChecked}
                                onCheckedChange={(v) => {
                                  const updatedSchedule = [
                                    ...(player?.schedule || []),
                                  ]

                                  if (v) {
                                    updatedSchedule.push({ day, hour })
                                  } else {
                                    const key = `${day}_${hour}`
                                    const filteredList = updatedSchedule.filter(
                                      (x) => `${x.day}_${x.hour}` !== key,
                                    )
                                    updatedSchedule.splice(
                                      0,
                                      updatedSchedule.length,
                                      ...filteredList,
                                    )
                                  }

                                  setPlayer({
                                    ...player,
                                    schedule: updatedSchedule.sort(sortDays),
                                  })
                                }}
                              />
                              <label
                                htmlFor={`${player.idplayer}_${day}_${hour}`}
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
              </TableBody>
            </Table>
          </div>

          <div className="w-full flex justify-center mt-4">
            {isLoading ? (
              <>
                <Loader2 className="h-7 w-7 animate-spin" />
                <span className="text-md ml-2">Carregando...</span>
              </>
            ) : (
              <div className="flex justify-between items-center gap-2">
                <Button
                  className="py-2 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
                  onClick={() => props.setVisibility('feed')}
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Voltar
                </Button>
                <Button
                  className="py-2 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
                  onClick={async () => {
                    try {
                      await editPlayerSchedule.execute(player)
                      await router.reload()
                    } catch (error) {
                      console.error('Erro ao editar player:', error)
                    }
                  }}
                >
                  <DatabaseIcon className="w-5 h-5 mr-2" />
                  Salvar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
