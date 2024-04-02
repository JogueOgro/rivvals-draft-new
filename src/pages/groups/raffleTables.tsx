import { useStore } from 'effector-react';
import React from 'react';

import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import groupsStore from '@/store/groups/groups-store';

export default function GroupsRaffle() {
  const { groupsQuantity, teamsPerGroup } = useStore(groupsStore);

  let content = [];
  let id = 0;

  for (let i = 0; i < Number(groupsQuantity); i++) {
    let contentrows = [];
    for (let k = 0; k < Number(teamsPerGroup); k++) {
      id = id + 1;
      contentrows.push(
        <TableRow>
          <TableCell className="font-medium h-14" id={String(id)}></TableCell>
        </TableRow>,
      );
    }

    content.push(
      <Card className="w-full mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Grupo {i + 1}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{contentrows}</TableBody>
        </Table>
      </Card>,
    );
  }
  return content;
}
