import { CalendarRange, Group, Swords, User } from 'lucide-react'

import { IMenuItemProps } from '@/components/menu-item'

const sidebarMenuItems: IMenuItemProps[] = [
  {
    menu: 'Draft',
    route: '/draft',
    icon: Swords,
  },
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
    icon: CalendarRange,
  },
]

export default sidebarMenuItems
