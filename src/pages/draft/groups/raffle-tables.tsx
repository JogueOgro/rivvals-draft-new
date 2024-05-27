import { useStore } from 'effector-react'
import React from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import groupsStore from '@/store/groups/groups-store'

export default function GroupsRaffle() {
  const { groupsQuantity, teamsPerGroup } = useStore(groupsStore)

  const content = []
  let id = 0

  for (let i = 0; i < Number(groupsQuantity); i++) {
    const contentrows = []
    for (let k = 0; k < Number(teamsPerGroup); k++) {
      id = id + 1
      contentrows.push(
        <TableRow className="bg-muted/65">
          <TableCell className="font-medium h-14" id={String(id)}></TableCell>
        </TableRow>,
      )
    }

    content.push(
      <Table className="w-full my-2">
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="font-bold text-black">
              GRUPO {i + 1}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{contentrows}</TableBody>
      </Table>,
    )
  }

  if (!content.length) return <></>

  return content
}
