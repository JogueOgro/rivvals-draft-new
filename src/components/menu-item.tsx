'use client'

import { useRouter } from 'next/router'

import { Button } from './ui/button'

export type IMenuItemProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any
  menu: string
  route: string
  index?: number
  activeMenuIndex?: number
  setActiveMenuIndex?: (i: number) => void
}

export default function MenuItem(props: IMenuItemProps) {
  const { icon: IconMenu, setActiveMenuIndex } = props
  const route = useRouter()

  const isActive = route.pathname === props.route

  return (
    <Button
      key={props.route}
      variant={!isActive ? 'outline' : 'default'}
      className={
        !isActive
          ? 'rounded-none w-full py-7 border-0 bg-transparent'
          : 'rounded-none w-full bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 hover:to-purple-900 py-8'
      }
      onClick={() => {
        route.push(props.route)
        if (setActiveMenuIndex) setActiveMenuIndex(props?.index || 0)
      }}
    >
      <div className="w-full flex items-center justify-between">
        <div className="w-full flex items-center justify-center">
          <IconMenu className="text-#757575 w-6" />
        </div>
      </div>
    </Button>
  )
}
