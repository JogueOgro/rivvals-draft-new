import { Group, Swords, User } from 'lucide-react'

import { IMenuItemProps } from '@/components/menu-item'

const sidebarMenuItems: IMenuItemProps[] = [
  {
    menu: 'Draft',
    route: '/draft',
    icon: Swords,
  },
  {
    menu: 'Sortear Grupos',
    route: '/groups',
    icon: Group,
  },
  {
    menu: 'Jogadores',
    route: '/player',
    icon: User,
  },
]

export default sidebarMenuItems
