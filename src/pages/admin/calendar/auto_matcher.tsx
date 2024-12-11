/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUnit } from 'effector-react'
import { Shield } from 'lucide-react'
import { useEffect, useState } from 'react'

import api from '@/clients/api'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import { IMatch } from '@/domain/match.domain'
import { fixStringToObj, weekDays } from '@/lib/utils'
import draftStore from '@/store/draft/draft-store'
import groupsStore from '@/store/groups/groups-store'

export default function AutoMatcher() {
  const { config } = useUnit(draftStore)
  const { groupsQuantity } = useUnit(groupsStore)
  const [matches, setMatches] = useState<IMatch[]>([])

  const getMatchData = async (draftEdition) => {
    try {
      const response = await api.get('/matches/' + draftEdition)
      const rawMatches = response.data
      const processedMatches = rawMatches.map((match) => ({
        ...match,
        freeSchedule: fixStringToObj(match.freeSchedule as string),
      }))
      setMatches(processedMatches)
    } catch (error) {
      console.error('Erro na busca de partidas:', error.message)
      if (error.response) {
        console.error('Status do erro:', error.response.status)
        console.error('Dados do erro:', error.response.data)
      }
    }
  }

  useEffect(() => {
    getMatchData(config?.edition)
  }, [config])

  return (
    <Card className="w-full flex flex-col p-8">
      {new Array(Number(groupsQuantity ?? 0)).fill('').map((_, i) => {
        const groupNum = i + 1
        const groupMatches = matches?.filter((x) => x.group === groupNum) || []
        console.log({ groupMatches })
        return (
          <Accordion
            key={groupNum.toString()}
            type="single"
            collapsible
            className="w-full"
          >
            <AccordionItem value={groupNum.toString()}>
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Shield />
                  <span className="font-bold">Grupo {groupNum}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {groupMatches?.map((x, i) => (
                  <div
                    key={i + 1}
                    className="p-4 rounded-sm bg-muted flex items-center gap-8"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium leading-none min-w-[400px]">
                        {`${x?.team1?.name} (${x?.team1?.number}) x ${x?.team2?.name} (${x?.team2?.number})`}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      {weekDays
                        .filter((y) => {
                          const isDayNotEmpty = x?.freeSchedule?.some(
                            (z) => z.day === y,
                          )
                          return isDayNotEmpty
                        })
                        .map((y, i) => {
                          const dayFreeSchedules = x?.freeSchedule?.filter(
                            (z) => z.day === y,
                          )
                          return (
                            <div key={i + 1}>
                              <div className="flex flex-col items-center">
                                <span>{y}</span>
                                <b>
                                  {dayFreeSchedules
                                    ?.map((z) => z.hour)
                                    ?.join(', ')}
                                </b>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )
      })}
    </Card>
  )
}
