'use client'

import { useStore } from 'effector-react'
import { useEffect } from 'react'

import HeadMetatags from '@/components/head-metatags'
import PageLayout from '@/components/page-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { draftEvent } from '@/store/draft/draft-events'
import draftStore from '@/store/draft/draft-store'

import CaptainSelection from './captain-selection'
import DraftConfig from './draft-config'
import DraftResult from './draft-result'
import PlayersSelect from './players-select'

export default function DraftPage() {
  const { activeTab, config } = useStore(draftStore)

  useEffect(() => {
    draftEvent({ timerSeconds: 60, isActiveTimer: false })
  }, [])

  return (
    <>
      <HeadMetatags title="Draft" />
      <PageLayout>
        <span className="text-3xl font-bold">Rivvals Draft {config?.name}</span>
        <div className="w-full rounded-md mt-12">
          <Tabs
            defaultValue="1"
            value={activeTab}
            onValueChange={(v) => draftEvent({ activeTab: v })}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="1" className="px-8">
                INFORMAÇÕES DO DRAFT
              </TabsTrigger>
              <TabsTrigger value="2" className="px-8" disabled={!config}>
                SELEÇÃO DE CAPITÃES
              </TabsTrigger>
              <TabsTrigger value="3" className="px-8" disabled={!config}>
                SELEÇÃO DE JOGADORES
              </TabsTrigger>
              <TabsTrigger value="4" className="px-8" disabled={!config}>
                RESUMO DO DRAFT
              </TabsTrigger>
            </TabsList>
            <TabsContent value="1">
              <DraftConfig />
            </TabsContent>
            <TabsContent value="2">
              <CaptainSelection />
            </TabsContent>
            <TabsContent value="3">
              <PlayersSelect />
            </TabsContent>
            <TabsContent value="4">
              <DraftResult />
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </>
  )
}
