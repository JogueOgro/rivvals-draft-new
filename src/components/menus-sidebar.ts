
import { IMenuItemProps } from '@/components/menu-item'
import { Calendar, Group, Table, User } from 'lucide-react'

const sidebarMenuItems: IMenuItemProps[] = [
  {
    menu: 'Jogadores',
    route: '/player',
    icon: User,
  },
  {
    menu: 'Agenda',
    route: '/schedule',
    icon: Calendar,
  },
]

export default sidebarMenuItems
