'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useStore } from 'effector-react'

import draftStore from '@/store/draft/draft-store'

import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function Overview() {
  const { config } = useStore(draftStore)
  const dataSource = config?.teamList?.map((team) => {
    const teamScore = [...team.players].reduce((total, player) => {
      return total + (player ? Number(player.stars) : 0)
    }, 0)
    const avgScore = teamScore / team?.players.length
    return { name: 'Time: ' + team.id, total: avgScore.toFixed(2) }
  })

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={dataSource}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip formatter={(value) => value} />
        <Bar dataKey="total" fill="#7f23d0" radius={[4, 4, 0, 0]}>
          {dataSource?.map((_, index) => (
            <LabelList
              key={`label-${index}`}
              data={dataSource as any}
              fill="#7f23d0"
              position="top"
              style={{ fontSize: 16, fontFamily: 'Arial', fontWeight: 'light' }}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
