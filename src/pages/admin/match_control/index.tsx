/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUnit } from 'effector-react'
import { Group } from 'lucide-react'
import { useEffect, useState } from 'react'

import api from '@/clients/api'
import HeadMetatags from '@/components/head-metatags'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IMatch } from '@/domain/match.domain'
import { fixSchedule } from '@/lib/utils'
import draftStore from '@/store/draft/draft-store'
import groupsStore from '@/store/groups/groups-store'

import MatchesConfig from './config'

export default function MatchControl() {
  const { config } = useUnit(draftStore)
  const draftEdition = config?.edition
  const [matches, setMatches] = useState<IMatch[]>([])
  const [activeTab, setActiveTab] = useState('1')
  const [activeView, setActiveView] = useState('1')
  const { groupsQuantity } = useUnit(groupsStore)
  const groupsQuantityNumber = Number(groupsQuantity)

  useEffect(() => {
    getMatchData(draftEdition)
  }, [draftEdition])

  const getMatchData = async (draftEdition) => {
    try {
      const response = await api.get('/matches/' + draftEdition)
      const rawMatches = response.data
      const processedMatches = rawMatches.map((match) => ({
        ...match,
        freeSchedule: fixSchedule(match.freeSchedule as string),
      }))
      setMatches(processedMatches)
    } catch (error) {
      console.error('Erro na busca de partidas:', error.message)
      if (error.response) {
        console.error('Status do erro:', error.response.status)
        console.error('Dados do erro:', error.response.data)
      }
    }
  }

  return (
    <>
      <HeadMetatags title="Match Control" />
      <div>
        <div className="w-full flex items-center gap-3 mb-6 ml-2">
          <span className="text-3xl font-bold">
            {
              {
                '1': `Controle de Partidas - Draft ${matches[0]?.draftEdition || 'N/A'}`,
                '2': `Grupos - Draft ${matches[0]?.draftEdition || 'N/A'}`,
                '3': `Playoffs - Draft ${matches[0]?.draftEdition || 'N/A'}`,
                '4': `Playoff Picture - Draft ${matches[0]?.draftEdition || 'N/A'}`,
              }[activeTab]
            }
          </span>
        </div>
        <div>
          <Tabs
            defaultValue="1"
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v)
            }}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="1" className="px-8" disabled={!matches}>
                CONTROLE
              </TabsTrigger>
              <TabsTrigger value="2" className="px-8" disabled={!matches}>
                GRUPOS
              </TabsTrigger>
              <TabsTrigger value="3" className="px-8" disabled={!matches}>
                PLAYOFFS
              </TabsTrigger>
              <TabsTrigger value="4" className="px-8" disabled={!matches}>
                PLAYOFF PICTURE
              </TabsTrigger>
            </TabsList>
            {!matches?.length ? (
              <Card className="p-12 text-center w-full">
                <span>Nenhuma partida encontrada...</span>
              </Card>
            ) : (
              <>
                <TabsContent value="1">
                  {/* <CaptainSelection /> */}
                </TabsContent>
                <TabsContent value="2">{/* <PlayersSelect /> */}</TabsContent>
                <TabsContent value="3">{/* <DraftResult /> */}</TabsContent>
                <TabsContent value="4">{/* <SortGroups /> */}</TabsContent>
              </>
            )}
          </Tabs>
          <Card className="w-full flex p-8">
            <Accordion
              type="single"
              value={activeView}
              collapsible
              className="w-full"
            >
              {Array.from({ length: groupsQuantityNumber }).map((_, index) => {
                const groupNumber = index + 1
                const groupMatches = matches.filter(
                  (match) => match.group === groupNumber,
                )

                return (
                  <AccordionItem
                    key={groupNumber}
                    value={`group-${groupNumber}`}
                  >
                    <AccordionTrigger
                      onClick={() =>
                        setActiveView(
                          activeView === `group-${groupNumber}`
                            ? ''
                            : `group-${groupNumber}`,
                        )
                      }
                    >
                      <div className="flex items-center gap-2">
                        <Group />
                        <span className="font-bold">Grupo {groupNumber}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {groupMatches.length > 0 ? (
                        <div>
                          {groupMatches.map((match, indexm) => (
                            <div key={match?.idmatch} className="mb-4">
                              <div>
                                <MatchesConfig index={indexm} match={match} />
                              </div>
                              {/* Outras informações do match */}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          Nenhuma partida encontrada neste grupo.
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </Card>
        </div>
      </div>
    </>
  )
}
