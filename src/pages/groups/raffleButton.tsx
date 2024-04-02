import { useStore } from 'effector-react';
import { ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import groupsStore from '@/store/groups/groups-store';

export default function RaffleButton() {
  const { groupsQuantity, teamsPerGroup } = useStore(groupsStore);
  const total = Number(groupsQuantity) * Number(teamsPerGroup);
  const [positions, setPositions] = useState<number[]>([]);
  let currentTeam = 1;

  useEffect(() => {
    let currentTeam = 1;
    const newPositions: number[] = [];
    setPositions(new Array(total));
  }, [total]);

  const handleClickRaffle = () => {
    if (currentTeam > total) {
      window.alert('Sorteio Concluído!');
    } else {
      let raffle = Math.floor(Math.random() * positions.length) + 1;
      while (positions.includes(raffle)) {
        raffle = Math.floor(Math.random() * positions.length) + 1;
      }
      positions[currentTeam - 1] = raffle;
      document.getElementById(String(raffle))!.innerHTML =
        'Time ' + currentTeam;
      currentTeam++;
    }
  };

  return (
    <Card className="h-full mt-8 mb-8 p-8 gap-4" hidden={!total}>
      <Button
        type="submit"
        className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 hover:to-purple-900 py-2"
        onClick={handleClickRaffle}
      >
        Sortear
        <ArrowRight className="w-5 h-5" />
      </Button>
    </Card>
  );
}
