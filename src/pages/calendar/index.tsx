'use client'

import HeadMetatags from '@/components/head-metatags'

import PlayerSchedules from './player-schedules'

export default function CalendarPage() {
  return (
    <>
      <HeadMetatags title="Draft" />
      <div>
        <div className="w-full flex items-center gap-3">
          <span className="text-3xl font-bold">Gerenciar horários</span>
        </div>
        <div className="w-full rounded-md mt-12">
          <PlayerSchedules />
        </div>
      </div>
    </>
  )
}
