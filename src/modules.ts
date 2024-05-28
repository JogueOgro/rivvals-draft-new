import { Calendar, LayoutDashboard, Swords, User } from 'lucide-react'

import { IMenuItemProps } from '@/components/menu-item'

const modules: IMenuItemProps[] = [
  {
    menu: 'Dashboard',
    route: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    menu: 'Draft',
    route: '/draft',
    icon: Swords,
  },
  {
    menu: 'Calendário',
    route: '/calendar',
    icon: Calendar,
  },
  {
    menu: 'Jogadores',
    route: '/player',
    icon: User,
  },
]

export default modules
