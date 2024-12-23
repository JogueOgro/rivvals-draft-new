import { ArrowLeftSquare, Atom, Calendar, Swords, User } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'

import logoImg from '@/assets/logo.png'
import MenuItem, { IMenuItemProps } from '@/components/menu-item'

const UserSidebar = (props) => {
  const [activeMenuIndex, setActiveMenuIndex] = useState(0)
  const showSidebar = false
  const route = useRouter()
  const loggedUser = props.loggedUser

  const handleExit = () => {
    localStorage.clear()
    route.push('/')
  }

  const profilePath = '/profile/' + loggedUser.username
  const userModules: IMenuItemProps[] = [
    {
      menu: 'Perfil',
      route: profilePath,
      icon: User,
    },
    {
      menu: 'Pro',
      route: '/admin/draft',
      icon: Atom,
    },
    {
      menu: 'Calendário',
      route: '/admin/calendar',
      icon: Calendar,
    },
    {
      menu: 'Partidas',
      route: '/admin/match_control',
      icon: Swords,
    },
  ]

  return (
    <div
      className="flex flex-col h-screen justify-between fixed shadow-2xl transition-width duration-200 ease-in-out bg-white no-print"
      style={{
        width: showSidebar ? 250 : 75,
        borderRadius: showSidebar ? '0 32px 32px 0' : '',
      }}
    >
      <div>
        <div className="flex justify-center w-full relative cursor-pointer">
          <Image
            src={logoImg}
            alt="logo"
            width={showSidebar ? 100 : 50}
            height={0}
            className="pt-4"
            priority
            onClick={() => {
              route.push(`/profile/${loggedUser.username}`)
              props.setVisibility('feed')
            }}
          />
        </div>
        <div className="border border-b-0 border-x-0 border-slate-300 mt-4">
          {userModules.map((item, index) => (
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
        <MenuItem index={99} menu="Sair" route={'/'} icon={ArrowLeftSquare} />
      </div>
    </div>
  )
}

export default UserSidebar
