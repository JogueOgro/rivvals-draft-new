import { useUnit } from 'effector-react'
import Image from 'next/image'
import { useState } from 'react'

import vsImg from '@/assets/vs.png'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
import { ITeam } from '@/domain/draft.domain'
import { IMatch } from '@/domain/match.domain'
import { sortDays } from '@/lib/utils'
import draftStore from '@/store/draft/draft-store'
import groupsStore from '@/store/groups/groups-store'
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

export default function AutoMatcher() {
  const { config } = useUnit(draftStore)
  const { groupsQuantity } = useUnit(groupsStore)
  const [activeView, setActiveView] = useState('1')
  const matches: IMatch[] = []
  let jointSchedules = []

  function uniqueSchedules(array) {
    const a = array.concat()
    for (let i = 0; i < a.length; ++i) {
      for (let j = i + 1; j < a.length; ++j) {
        if (a[i].day === a[j].day && a[i].hour === a[j].hour) a.splice(j--, 1)
      }
    }
    return a
  }

  function joinSchedules(team1: ITeam, team2: ITeam) {
    // console.log(team1, team2)
    const allschedules = uniqueSchedules(
      team1.schedules.concat(team2.schedules),
    )
    allschedules.sort(sortDays)
    return allschedules
  }

  function findMatch(team1, team2, schedule) {
    const freeSchedule = []
    if (schedule.length === 0) {
      return fullSchedule
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
    const match: IMatch = {
      team1,
      team2,
      freeSchedule,
      phase: 'group',
      group: team1.group,
      isScheduled: false,
      isDone: false,
      format: 'md1',
    }
    return match
  }

  for (let index = 1; index <= Number(groupsQuantity); index++) {
    const teams = config?.teamList?.filter((x) => x.group === index)
    for (let s = 0; s < teams?.length - 1; s++) {
      const team1 = s
      for (let t = s; t <= teams?.length - 2; t++) {
        const team2 = t + 1
        jointSchedules = joinSchedules(teams[team1], teams[team2])
        matches.push(findMatch(teams[team1], teams[team2], jointSchedules))
      }
    }
  }

  const hours = ['19', '20', '21', '22']
  const content = []

  console.log(matches)
  // content.push(
  //   <div>
  //     <Accordion
  //       type="single"
  //       value={activeView}
  //       collapsible
  //       className="w-full"
  //     ></Accordion>
  //     <Accordion
  //       type="single"
  //       value={activeView}
  //       collapsible
  //       className="w-full"
  //     ></Accordion>
  //     <Accordion type="single" value={activeView} collapsible className="w-full"></Accordion>
  //     </div>
  // )

  // for (let index = 0; index < Number(groupsQuantity); index++) {
  //   const groupMatches = matches.filter((x) => x.group === index + 1)
  //   content.push(<AccordionItem value={String(index + 1)}>
  //     <AccordionTrigger onClick={() => setActiveView(String(index + 1))}>
  //     <div className="flex items-center gap-2">
  //       <span className="font-bold">{'Grupo '+String(index+1)}</span>
  //     </div>
  //     </AccordionTrigger>
  //     <AccordionContent>
  //   )
  //   for (let g = 0; g < groupMatches.length; g++) {
  //     content.push(<div>{groupMatches[g].team1.id +' vs '+ groupMatches[g].team2.id}</div>)
  //   }
  //   content.push(</AccordionContent>
  //     </AccordionItem>)
  // }

  // content.push(</Accordion></div>)

  // for (let index = 0; index < weekDays.length - 2; index++) {
  //   const contentrows = []

  //   for (let m = 0; m < matches.length; m++) {
  //     const free = matches[m]?.freeSchedule
  //     for (let f = 0; f < free.length; f++) {
  //       if (weekDays[index] === free[f].day) {
  //         if ()
  //         console.log(weekDays[index])
  //         contentrows.push(
  //           <TableRow className="bg-muted/65">
  //             <TableCell
  //               className="font-medium h-14"
  //               id={String(id)}
  //             ></TableCell>
  //           </TableRow>,
  //         )
  //       }
  //     }
  //   }
  // }

  //   content.push(
  //     <Table className="w-full my-2">
  //       <TableHeader>
  //         <TableRow className="bg-muted">
  //           <TableHead className="font-bold text-black">
  //             {' '}
  //             {weekDays[index]}
  //           </TableHead>
  //         </TableRow>
  //       </TableHeader>
  //       <TableBody>{contentrows}</TableBody>
  //     </Table>,
  //   )
  // }

  for (let index = 0; index < Number(groupsQuantity); index++) {
    const groupMatches = matches.filter((x) => x.group === index + 1)
    content.push(<div>{'Grupo ' + String(index + 1)}</div>)
    for (let g = 0; g < groupMatches.length; g++) {
      content.push(
        <div>
          {'Time ' +
            groupMatches[g].team1.id +
            ' vs ' +
            'Time ' +
            groupMatches[g].team2.id +
            ' '}
          - Horários:
        </div>,
      )
      if (groupMatches[g].freeSchedule.length === 0) {
        content.push(<div>Sem horários livres</div>)
      }
      for (let h = 0; h < groupMatches[g].freeSchedule.length; h++) {
        content.push(
          <div class="inline">
            {groupMatches[g].freeSchedule[h].day +
              ' ' +
              groupMatches[g].freeSchedule[h].hour +
              'h' +
              ' - '}
          </div>,
        )
      }
    }
  }

  if (!content.length) return <></>

  return content
}
