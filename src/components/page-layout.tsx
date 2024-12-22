import { useUnit } from 'effector-react'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'

import api from '@/clients/api'
import authStore from '@/store/auth/auth-store'

import AnimatedBackground from './animated-background'
import Sidebar from './sidebar'

const showSidebar = false

const PageLayout = ({ children }: { children: ReactNode }) => {
  const { asPath } = useRouter()
  const { loggedEmail } = useUnit(authStore)
  const router = useRouter()
  const data = { loggedEmail, auth: 'admin' }

  useEffect(() => {
    const checkAuthorization = async (data) => {
      try {
        const response = await api.post('/checkauth', data)

        if (!response.data.isAuthorized) {
          router.push('/')
        }
      } catch (error) {
        console.error('Erro ao verificar autorização:', error)
        router.push('/')
      }
    }

    if (asPath.startsWith('/admin')) {
      checkAuthorization(data)
    }
  }, [router])

  if (asPath.startsWith('/admin') && asPath !== '/admin') {
    return (
      <div
        className="flex min-h-screen"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <AnimatedBackground />
        <Sidebar {...{ showSidebar }} />
        <div
          className="flex flex-col flex-1 overflow-hidden central-box"
          style={{
            marginLeft: showSidebar ? 250 : 75,
          }}
        >
          <main
            className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-12 main-print"
            style={{ zIndex: 1 }}
          >
            {children}
          </main>
        </div>
      </div>
    )
  } else if (asPath.startsWith('/profile')) {
    return (
      <div
        className="flex min-h-screen"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <AnimatedBackground />
        {children}
      </div>
    )
  } else {
    return (
      <>
        <div
          className="flex min-h-screen"
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <AnimatedBackground />
          {children}
        </div>
      </>
    )
  }
}

export default PageLayout
