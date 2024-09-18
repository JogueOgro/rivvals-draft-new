'use client'

import { useUnit } from 'effector-react'

import HeadMetatags from '@/components/head-metatags'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import playerStore from '@/store/player/player-store'

import AutoMatcher from './auto_matcher'
import GameSchedule from './game-schedule'
import PlayerSchedules from './player-schedules'

export default function CalendarPage() {
  const { players } = useUnit(playerStore)
  return (
    <>
      <HeadMetatags title="Calendário" />
      <div>
        <div className="w-full flex items-center gap-3">
          <span className="text-3xl font-bold">Gerenciar horários</span>
        </div>
        <div className="w-full rounded-md mt-12">
          <Tabs defaultValue="1" className="w-full">
            <TabsList>
              <TabsTrigger value="1" className="px-8">
                HORÁRIOS INDISPONÍVEIS (MARCAR)
              </TabsTrigger>
              <TabsTrigger value="2" className="px-8">
                CHECAR HORÁRIOS
              </TabsTrigger>
              <TabsTrigger value="3" className="px-8">
                MARCAÇÃO DE JOGOS
              </TabsTrigger>
            </TabsList>
            {!players?.length ? (
              <Card className="p-12 text-center w-full">
                <span>Nenhum jogador encontrado...</span>
              </Card>
            ) : (
              <>
                <TabsContent value="1">
                  <PlayerSchedules />
                </TabsContent>
                <TabsContent value="2">
                  <GameSchedule />
                </TabsContent>
                <TabsContent value="3">
                  <AutoMatcher />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </>
  )
}
