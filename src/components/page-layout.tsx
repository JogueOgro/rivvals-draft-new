import { useRouter } from 'next/router'
import { ReactNode } from 'react'

import AnimatedBackground from './animated-background'
import Sidebar from './sidebar'

const showSidebar = false

const PageLayout = ({ children }: { children: ReactNode }) => {
  const { asPath } = useRouter()

  if (asPath === '/admin') {
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
  } else {
    return (
      <>
        <AnimatedBackground />
        {children}
      </>
    )
  }
}

export default PageLayout
