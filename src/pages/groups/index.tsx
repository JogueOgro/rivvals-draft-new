import { useStore } from 'effector-react'
import { Group, Settings } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import HeadMetatags from '@/components/head-metatags'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import { groupsEvent } from '@/store/groups/groups-events'
import { groupsInitialState } from '@/store/groups/groups-state'
import groupsStore from '@/store/groups/groups-store'

import GroupsConfig from './config'
import RaffleButton from './raffle-button'
import GroupsRaffle from './raffle-tables'

const GroupsPage = () => {
  const [activeView, setActiveView] = useState('1')
  const { groupsQuantity, teamsPerGroup } = useStore(groupsStore)

  useEffect(() => {
    groupsEvent(groupsInitialState)
  }, [])

  return (
    <>
      <HeadMetatags title="Grupos" />
      <div>
        <div className="flex items-center justify-between flex-col sm:flex-row gap-2 pb-12">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">Grupos</span>
            <span className="text-lg font-light pt-2">Sorteio de Grupos</span>
          </div>
        </div>
        <Card className="w-full flex p-8">
          <Accordion
            type="single"
            value={activeView}
            collapsible
            className="w-full"
          >
            <AccordionItem value="1">
              <AccordionTrigger onClick={() => setActiveView('1')}>
                <div className="flex items-center gap-2">
                  <Settings />
                  <span className="font-bold">Configurações</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <GroupsConfig setActiveView={setActiveView} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="2">
              <AccordionTrigger onClick={() => setActiveView('2')}>
                <div className="flex items-center gap-2">
                  <Group />
                  <span className="font-bold">Grupos</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <RaffleButton />
                <div
                  className="grid w-full gap-4 grid-cols-4 mt-4"
                  style={{
                    opacity: groupsQuantity && teamsPerGroup ? '1' : '0',
                  }}
                >
                  <GroupsRaffle />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </>
  )
}

export default GroupsPage
