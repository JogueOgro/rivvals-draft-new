import { Calendar, LayoutDashboard, Swords, User } from 'lucide-react'

import { IMenuItemProps } from '@/components/menu-item'

const modules: IMenuItemProps[] = [
  {
    menu: 'Dashboard',
    route: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    menu: 'Draft',
    route: '/admin/draft',
    icon: Swords,
  },
  {
    menu: 'Calendário',
    route: '/admin/calendar',
    icon: Calendar,
  },
  {
    menu: 'Jogadores',
    route: '/admin/player',
    icon: User,
  },
]

export default modules
