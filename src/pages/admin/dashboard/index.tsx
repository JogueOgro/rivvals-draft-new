'use client'

import HeadMetatags from '@/components/head-metatags'

import DashboardPage from './page'

export default function Dashboard() {
  return (
    <>
      <HeadMetatags title="Dashboard" />
      <DashboardPage />
    </>
  )
}
