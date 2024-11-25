import { useUnit } from 'effector-react'
import { Shuffle } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import tenasBag from '@/assets/tenas-bag.gif'
import tenas from '@/assets/tenas.gif'
import api from '@/clients/api'
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { sleep } from '@/lib/utils'
import { draftEvent } from '@/store/draft/draft-events'
import draftStore from '@/store/draft/draft-store'
import groupsStore from '@/store/groups/groups-store'
import { createMatchesUseCase } from '@/useCases/match/create-matches.useCase'

export default function RaffleButton() {
  const [tenasOpen, setTenasOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { groupsQuantity, teamsPerGroup } = useUnit(groupsStore)
  const { config } = draftStore.getState()
  const [positions, setPositions] = useState<number[]>([])
  const total = Number(groupsQuantity) * Number(teamsPerGroup)

  const [currentTeam, setCurrentTeam] = useState(1)

  useEffect(() => {
    setPositions(new Array(total))
  }, [total])

  const teamList = [...config!.teamList!]

  const handleClickRaffle = async () => {
    if (currentTeam > total) {
      // @ts-ignore
      draftEvent({
        config: { ...config, teamList },
        activeTab: '4',
      })
      const data = { groupsQuantity, teamsPerGroup }

      api
        .put('/draft/' + config?.edition + '/groups', data)
        .then((response) => {
          if (response.status === 200) {
            console.log('Dados de grupo atualizados com sucesso')
          } else {
            console.log('Erro na resposta', response)
          }
        })
        .catch((error) => {
          console.error('Erro na requisição', error)
        })

      api
        .put('/teams', teamList)
        .then((response) => {
          if (response.status === 200) {
            console.log('Dados de times atualizados com sucesso')
          } else {
            console.log('Erro na resposta', response)
          }
        })
        .catch((error) => {
          console.error('Erro ao buscar dados:', error.message)
          if (error.response) {
            console.error('Status do erro:', error.response.status)
            console.error('Dados do erro:', error.response.data)
          }
        })
      // @ts-ignore
      const edition = String(config.edition)
      createMatchesUseCase.execute({ edition, teamList, groupsQuantity })
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
      teamList[currentTeam - 1].group = Math.ceil(
        raffle / Number(teamsPerGroup),
      )
      const capname = teamList[currentTeam]?.players[0].nick
      document.getElementById(String(raffle))!.innerHTML =
        'Time ' + currentTeam + ' (' + capname + ')'
      setCurrentTeam((oldState) => oldState + 1)
      setIsLoading(false)
      setTenasOpen(false)
    }
  }

  return (
    <>
      <Button
        onClick={handleClickRaffle}
        className="mt-8 w-[300px] bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600  py-2"
      >
        {currentTeam > total ? 'Concluir' : 'Sortear'}
        <Shuffle className="w-5 h-5 ml-2" />
      </Button>
      <AlertDialog open={tenasOpen} onOpenChange={setTenasOpen}>
        <AlertDialogContent className="bg-transparent ring-0 border-none shadow-none flex flex-col items-center justify-center">
          <h1 className="text-[60px] text-white font-bold shrink-0 text-nowrap text-center">
            Tenas enfiou a mão no saco!!!
          </h1>
          <Image
            src={!isLoading ? tenas : tenasBag}
            width={350}
            height={350}
            alt="Tenas"
            priority
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
