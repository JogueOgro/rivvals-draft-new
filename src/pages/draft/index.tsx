'use client'

import { useUnit } from 'effector-react'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

import tmiClient from '@/clients/twitch'
import HeadMetatags from '@/components/head-metatags'
import TimerClock from '@/components/timer'
import TwitchChat from '@/components/twitch.chat'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { draftEvent } from '@/store/draft/draft-events'
import draftStore from '@/store/draft/draft-store'
import playerStore from '@/store/player/player-store'

import CaptainSelection from './captain-selection'
import DraftResult from './draft-result'
import SortGroups from './groups'

const PlayersSelect = dynamic(() => import('./players-select'), { ssr: false })

export default function DraftPage() {
  const { players } = useUnit(playerStore)
  const { activeTab, config, activeTeamIndex } = useUnit(draftStore)

  const filterSelectionCaptain =
    config?.teamList &&
    config?.teamList[activeTeamIndex]?.players?.find((x) => x?.isCaptain)

  useEffect(() => {
    draftEvent({ timerSeconds: 60, isActiveTimer: false, activeTab: '1' })
  }, [])

  useEffect(() => {
    tmiClient.connect()
    return () => {
      tmiClient.disconnect()
    }
  }, [])

  return (
    <>
      <HeadMetatags title="Draft" />
      <div>
        {activeTab === '2' && (
          <>
            <TimerClock />
            <TwitchChat />
          </>
        )}
        <div className="w-full flex items-center gap-3">
          <span className="text-3xl font-bold">
            {
              {
                '1': `Seleção de Capitães`,
                '2': `Time ${activeTeamIndex + 1} - Capitão: `,
                '3': `Resumo do Draft`,
                '4': `Sorteio de Grupos`,
                '5': `Comparar agendas`,
              }[activeTab]
            }
          </span>
          {activeTab === '2' && filterSelectionCaptain && (
            <div className="text-white text-lg font-semibold text-center pt-[2px] rounded-full w-fit px-2 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 ">
              &nbsp;{filterSelectionCaptain?.name}&nbsp;
            </div>
          )}
        </div>
        <div className="w-full rounded-md mt-12">
          <Tabs
            defaultValue="1"
            value={activeTab}
            onValueChange={(v) =>
              draftEvent({ activeTab: v, isActiveTimer: false })
            }
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="1" className="px-8" disabled={!config}>
                SELEÇÃO DE CAPITÃES
              </TabsTrigger>
              <TabsTrigger value="2" className="px-8" disabled={!config}>
                SELEÇÃO DE JOGADORES
              </TabsTrigger>
              <TabsTrigger value="3" className="px-8" disabled={!config}>
                RESUMO DO DRAFT
              </TabsTrigger>
              <TabsTrigger value="4" className="px-8" disabled={!config}>
                SORTEIO DE GRUPOS
              </TabsTrigger>
            </TabsList>
            {!players?.length ? (
              <Card className="p-12 text-center w-full">
                <span>Nenhum jogador encontrado...</span>
              </Card>
            ) : (
              <>
                <TabsContent value="1">
                  <CaptainSelection />
                </TabsContent>
                <TabsContent value="2">
                  <PlayersSelect />
                </TabsContent>
                <TabsContent value="3">
                  <DraftResult />
                </TabsContent>
                <TabsContent value="4">
                  <SortGroups />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </>
  )
}
