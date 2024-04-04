import { useStore } from 'effector-react'
import { Shuffle } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import tenasBag from '@/assets/tenas-bag.gif'
import tenas from '@/assets/tenas.gif'
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { sleep } from '@/lib/utils'
import groupsStore from '@/store/groups/groups-store'

export default function RaffleButton() {
  const [tenasOpen, setTenasOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { groupsQuantity, teamsPerGroup } = useStore(groupsStore)
  const [positions, setPositions] = useState<number[]>([])
  const total = Number(groupsQuantity) * Number(teamsPerGroup)

  const [currentTeam, setCurrentTeam] = useState(1)

  useEffect(() => {
    setPositions(new Array(total))
  }, [total])

  const handleClickRaffle = async () => {
    if (currentTeam > total) {
      window.alert('Sorteio Concluído!')
    } else {
      setTenasOpen(true)
      setIsLoading(true)
      await sleep(3000)
      let raffle = Math.floor(Math.random() * positions.length) + 1
      while (positions.includes(raffle)) {
        raffle = Math.floor(Math.random() * positions.length) + 1
      }
      positions[currentTeam - 1] = raffle
      document.getElementById(String(raffle))!.innerHTML = 'Time ' + currentTeam
      setCurrentTeam((oldState) => oldState + 1)
      setIsLoading(false)
      setTenasOpen(false)
    }
  }

  return (
    <>
      <Button
        onClick={handleClickRaffle}
        className="mt-8 w-[300px] bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 hover:to-purple-900 py-2"
      >
        Sortear
        <Shuffle className="w-5 h-5 ml-2" />
      </Button>
      <AlertDialog open={tenasOpen} onOpenChange={setTenasOpen}>
        <AlertDialogContent className="bg-transparent ring-0 border-none">
          <Image
            src={!isLoading ? tenas : tenasBag}
            width={0}
            height={0}
            layout="responsive"
            alt="Tenas"
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
