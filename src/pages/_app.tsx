'use client'

import { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { Montserrat } from 'next/font/google'
import { useEffect } from 'react'

import tmiClient from '@/clients/twitch'
import PageLayout from '@/components/page-layout'
import { Toaster } from '@/components/ui/toaster'

import './_globals.css'

const Providers = dynamic(() => import('@/providers'), { ssr: false })
const inter = Montserrat({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    tmiClient.connect()
    return () => {
      tmiClient.disconnect()
    }
  }, [])

  return (
    <main className={inter.className}>
      <Providers>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </Providers>
      <Toaster />
    </main>
  )
}
