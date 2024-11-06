import { ArrowRightSquare } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'

import logoImg from '@/assets/logo.png'
import modules from '@/modules'
import { draftEvent } from '@/store/draft/draft-events'
import { draftInitialState } from '@/store/draft/draft-state'
import { playerEvent } from '@/store/player/player-events'
import { playerInitialState } from '@/store/player/player-state'

import MenuItem from './menu-item'

type IProps = {
  showSidebar: boolean
}

const Sidebar = ({ showSidebar }: IProps) => {
  const [activeMenuIndex, setActiveMenuIndex] = useState(0)

  const route = useRouter()

  const handleExit = () => {
    localStorage.clear()
    playerEvent(playerInitialState)
    draftEvent(draftInitialState)
    route.push('/')
  }

  return (
    <div
      className="flex flex-col h-screen justify-between fixed shadow-2xl transition-width duration-200 ease-in-out bg-white no-print"
      style={{
        width: showSidebar ? 250 : 75,
        borderRadius: showSidebar ? '0 32px 32px 0' : '',
      }}
    >
      <div>
        <div className="flex justify-center w-full relative">
          <Image
            src={logoImg}
            alt="logo"
            width={showSidebar ? 100 : 50}
            height={0}
            className="pt-10"
            priority
          />
        </div>
        <div className="border border-b-0 border-x-0 border-slate-300 mt-8">
          {modules.map((item, index) => (
            <div
              key={item.menu}
              className="border border-t-0 border-x-0 border-slate-300"
            >
              <MenuItem
                {...{
                  ...item,
                  key: index,
                  index,
                  showSidebar,
                  activeMenuIndex,
                  setActiveMenuIndex,
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        className="border border-b-0 border-x-0 border-slate-300"
        onClick={handleExit}
      >
        <MenuItem index={99} menu="Sair" route={'/'} icon={ArrowRightSquare} />
      </div>
    </div>
  )
}

export default Sidebar
