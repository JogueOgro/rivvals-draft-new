import { useUnit } from 'effector-react'
import { Ban, Pin, ShieldHalf, Swords } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import draftStore from '@/store/draft/draft-store'
import playerStore from '@/store/player/player-store'

import Overview from './components/overview'
import TeamsList from './components/teams-list'

export default function DashboardPage() {
  const { players } = useUnit(playerStore)
  const { config } = useUnit(draftStore)

  const rivvalsTotalPlayers = players.length
  const rivvalsTotalScore = [...players].reduce((total, player) => {
    return total + (player ? Number(player.stars) : 0)
  }, 0)
  const rivvalsAvgScore = Math.abs(rivvalsTotalScore / rivvalsTotalPlayers)
  const excludedPlayers = [...players]?.filter((x) => x.isExcluded).length || 0

  return (
    <div className="hidden flex-col md:flex">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Análitico
            </TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Auditoria
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Players</CardTitle>
                  <Swords />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{players.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Times</CardTitle>
                  <ShieldHalf />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {config?.teamList?.length || 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Score</CardTitle>
                  <Pin />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {rivvalsAvgScore.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Score médio dos players
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Desistentes
                  </CardTitle>
                  <Ban />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{excludedPlayers}</div>
                  <p className="text-xs text-muted-foreground">
                    Players que se inscreveram e não vão poder jogar
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Score médio por time</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Ranking</CardTitle>
                  <CardDescription>
                    Lista de times do campeonato com base no score médio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TeamsList />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
