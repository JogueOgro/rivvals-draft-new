import { Calendar, Group, User } from 'lucide-react'

import { IMenuItemProps } from '@/components/menu-item'

const sidebarMenuItems: IMenuItemProps[] = [
  {
    menu: 'Jogadores',
    route: '/player',
    icon: User,
  },
  {
    menu: 'Sortear Grupos',
    route: '/groups',
    icon: Group,
  },
  {
    menu: 'Agenda',
    route: '/schedule',
    icon: Calendar,
  },
]

export default sidebarMenuItems
