'use client'

import HeadMetatags from '@/components/head-metatags'
import PageLayout from '@/components/page-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DraftConfig from './config'
import { Card } from '@/components/ui/card'
import { useStore } from 'effector-react'
import draftStore from '@/store/draft/draft-store'
import { draftEvent } from '@/store/draft/draft-events'
import CaptainSelectionTable from './captain-selection'
import PlayersSelect from './players-select'
import { useEffect } from 'react'
import { draftInitialState } from '@/store/draft/draft-state'

export default function DraftPage() {
  const { activeTab, config } = useStore(draftStore)

  useEffect(() => {
    draftEvent({ activeTab: '1' })
  }, [])

  return (
    <>
      <HeadMetatags title="Draft" />
      <PageLayout>
        <span className="text-3xl font-bold">Rivvals Draft {config?.name}</span>
        <div className="w-full rounded-md mt-20">
          <Tabs defaultValue="1" value={activeTab} onValueChange={(v) => draftEvent({ activeTab: v })} className="w-full">
            <TabsList>
              <TabsTrigger value="1" className="px-8">INFORMAÇÕES DO DRAFT</TabsTrigger>
              <TabsTrigger value="2" className="px-8">SELEÇÃO DE CAPITÃES</TabsTrigger>
              <TabsTrigger value="3" className="px-8">SELEÇÃO DE JOGADORES</TabsTrigger>
              <TabsTrigger value="4" className="px-8">RESUMO DO DRAFT</TabsTrigger>
            </TabsList>
            <TabsContent value="1">
              <DraftConfig />
            </TabsContent>
            <TabsContent value="2">
              <CaptainSelectionTable />
            </TabsContent>
            <TabsContent value="3">
              <PlayersSelect />
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </>
  )
}
