import { Atom, Calendar, LayoutDashboard, Swords, User } from 'lucide-react'

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
  {
    menu: 'Jogadores',
    route: '/admin/player',
    icon: User,
  },
]

export default modules
