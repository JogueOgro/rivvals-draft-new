/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUnit } from 'effector-react'
import { Shield } from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import { ITeam } from '@/domain/draft.domain'
import { IMatch } from '@/domain/match.domain'
import draftStore from '@/store/draft/draft-store'
import groupsStore from '@/store/groups/groups-store'

type ISchedule = { day: string; hour: number }

export default function AutoMatcher() {
  const { config } = useUnit(draftStore)
  const { groupsQuantity } = useUnit(groupsStore)
  const [matches, setMatches] = useState<IMatch[]>([])

  useEffect(() => {
    const pageData = getPageData(groupsQuantity, config?.teamList)
    setMatches(pageData)
  }, [config, groupsQuantity])

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

const weekDays = [
  'SEGUNDA-FEIRA',
  'TERÇA-FEIRA',
  'QUARTA-FEIRA',
  'QUINTA-FEIRA',
  'SEXTA-FEIRA',
  'SABADO',
  'DOMINGO',
]

const fullSchedule = [
  { day: 'SEGUNDA-FEIRA', hour: 19 },
  { day: 'SEGUNDA-FEIRA', hour: 20 },
  { day: 'SEGUNDA-FEIRA', hour: 21 },
  { day: 'SEGUNDA-FEIRA', hour: 22 },
  { day: 'TERÇA-FEIRA', hour: 19 },
  { day: 'TERÇA-FEIRA', hour: 20 },
  { day: 'TERÇA-FEIRA', hour: 21 },
  { day: 'TERÇA-FEIRA', hour: 22 },
  { day: 'QUARTA-FEIRA', hour: 19 },
  { day: 'QUARTA-FEIRA', hour: 20 },
  { day: 'QUARTA-FEIRA', hour: 21 },
  { day: 'QUARTA-FEIRA', hour: 22 },
  { day: 'QUINTA-FEIRA', hour: 19 },
  { day: 'QUINTA-FEIRA', hour: 20 },
  { day: 'QUINTA-FEIRA', hour: 21 },
  { day: 'QUINTA-FEIRA', hour: 22 },
  { day: 'SEXTA-FEIRA', hour: 19 },
  { day: 'SEXTA-FEIRA', hour: 20 },
  { day: 'SEXTA-FEIRA', hour: 21 },
  { day: 'SEXTA-FEIRA', hour: 22 },
]

function findMatch(team1: ITeam, team2: ITeam, schedule: ISchedule[]) {
  const freeSchedule = [] as ISchedule[]
  if (schedule.length === 0) {
    return {
      team1,
      team2,
      freeSchedule: fullSchedule,
      phase: 'group',
      group: team1.group,
      isScheduled: false,
      isDone: false,
      format: 'md1',
    }
  } else {
    for (let index = 0; index < fullSchedule.length; index++) {
      for (let f = 0; f < schedule.length; f++) {
        if (
          JSON.stringify(fullSchedule[index]) === JSON.stringify(schedule[f])
        ) {
          break
        }
        if (f === schedule.length - 1) {
          freeSchedule.push(fullSchedule[index])
          break
        }
      }
    }
  }

  return {
    team1,
    team2,
    freeSchedule,
    phase: 'group',
    group: team1.group,
    isScheduled: false,
    isDone: false,
    format: 'md1',
  } as IMatch
}

function getPageData(groupsQuantity?: string, teamList?: ITeam[]) {
  const newListMatch = [] as IMatch[]
  for (let index = 1; index <= Number(groupsQuantity); index++) {
    const teams = teamList?.filter((x) => x.group === index) || []
    for (let s = 0; s < teams?.length - 1; s++) {
      const team1 = s
      for (let t = s; t <= teams?.length - 2; t++) {
        const team2 = t + 1
        const jointSchedules: ISchedule[] = [
          ...teams[team1].schedules,
          ...teams[team2].schedules,
        ]
        if (team1 !== team2) {
          const matchData = findMatch(
            teams[team1],
            teams[team2],
            jointSchedules,
          )
          // console.log(team1, team2)
          newListMatch.push(matchData)
        }
      }
    }
  }

  return newListMatch
}
