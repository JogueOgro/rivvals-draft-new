import { ReactNode } from 'react'

import Sidebar from './sidebar'

const showSidebar = false

const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundImage: `url("/static/background.png")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Sidebar {...{ showSidebar }} />
      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={{
          marginLeft: showSidebar ? 250 : 75,
        }}
      >
        <main className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-12">
          {children}
        </main>
      </div>
    </div>
  )
}

export default PageLayout
