'use client'

import { DatabaseIcon, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import api from '@/clients/api'
import HeadMetatags from '@/components/head-metatags'
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

export default function CalendarSection() {
  const [isLoading, setIsLoading] = useState(true)
  const [player, setPlayer] = useState({})

  const getPlayerByEmail = async () => {
    try {
      const response = await api.get('/player/email/ogro@levva.io')
      response.data.schedule = fixStringToObj(response.data.schedule)
      setPlayer(response.data)
    } catch (error) {
      console.error('Erro na busca de jogadores:', error.message)
      if (error.response) {
        console.error('Status do erro:', error.response.status)
        console.error('Dados do erro:', error.response.data)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getPlayerByEmail()
  }, [])

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
      <HeadMetatags title="Editar Agenda Pessoal" description="Editar Agenda" />
      <div className="p-4 overflow-hidden flex w-full min-h-screen items-center justify-center">
        <div className="flex flex-col pb-12 rounded animate-in fade-in shadow-lg transition-all duration-1000 bg-white w-full max-w-[1000px] my-4 backdrop-filter backdrop-blur-lg bg-opacity-40 border-t border-t-gray-200">
          <div className="flex w-full items-center justify-center mt-4 p-4">
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

            <Button
              disabled={isLoading}
              type="submit"
              className="w-1/2 flex justify-center items-center gap-2 mt-12 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-7 w-7 animate-spin" />
                  <span className="text-md ml-2">Carregando...</span>
                </>
              ) : (
                <Button
                  className="min-w-[300px] py-2 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600"
                  onClick={() => editPlayerSchedule.execute(player)}
                >
                  <DatabaseIcon className="w-5 h-5 mr-2" />
                  Salvar
                </Button>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
