import { useUnit } from 'effector-react'
import { ShieldHalf } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import draftStore from '@/store/draft/draft-store'

export default function TeamsList() {
  const { config } = useUnit(draftStore)

  const calculatedListWithTeamAvgScore = config?.teamList
    ?.map((team) => {
      const teamScore = [...team.players].reduce((total, player) => {
        return total + (player ? Number(player.stars) : 0)
      }, 0)
      const avgScore = teamScore / team?.players.length
      return { ...team, avgScore: avgScore.toFixed(2) }
    })
    ?.sort((a, b) => Number(b.avgScore) - Number(a.avgScore))

  return (
    <div className="space-y-4 max-h-[350px] overflow-auto">
      {calculatedListWithTeamAvgScore?.map((x) => {
        const captain = x.players?.find((y) => y.isCaptain)
        return (
          <div className="flex items-center border-b pb-3 pr-4" key={x.id}>
            <Avatar className="h-9 w-9">
              <AvatarFallback>
                <ShieldHalf />
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-bold leading-none">Time: {x.id}</p>
              <p className="text-sm text-muted-foreground">
                Capitão: {captain?.name || '-'}
              </p>
            </div>
            <div className="ml-auto text-sm">
              Score Médio: <b>{x.avgScore}</b>
            </div>
          </div>
        )
      })}
    </div>
  )
}
