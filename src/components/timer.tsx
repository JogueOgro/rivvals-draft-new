import { useStore } from 'effector-react'
import { PlayCircle, XCircle } from 'lucide-react'
import { useEffect, useMemo } from 'react'

import { draftEvent } from '@/store/draft/draft-events'
import draftStore from '@/store/draft/draft-store'

import { Button } from './ui/button'

const TimerClock = () => {
  const { isActiveTimer, timerSeconds } = useStore(draftStore)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActiveTimer && timerSeconds > 0) {
      interval = setInterval(() => {
        draftEvent({ timerSeconds: timerSeconds - 1 })
      }, 1000)
    } else {
      draftEvent({ isActiveTimer: false })
      return
    }

    return () => clearInterval(interval)
  }, [isActiveTimer, timerSeconds])

  return useMemo(
    () => (
      <div className="flex justify-center absolute right-[48px] top-[6px]">
        <Button
          variant="ghost"
          className="rounded-sm z-50 right-0 absolute"
          onClick={() => {
            if (isActiveTimer) {
              draftEvent({ isActiveTimer: false, timerSeconds: 60 })
            } else {
              draftEvent({ isActiveTimer: true, timerSeconds: 60 })
            }
          }}
        >
          {isActiveTimer ? (
            <XCircle className="text-red-500" />
          ) : (
            <PlayCircle className="text-blue-600" />
          )}
        </Button>
        <div className="flex flex-col gap-5 relative">
          <div className="h-16 w-16 sm:w-32 sm:h-32 lg:w-40 lg:h-40 flex justify-between items-center border bg-white rounded-2xl">
            <div className="relative h-2.5 w-2.5 sm:h-3 sm:w-3 !-left-[6px] rounded-full bg-blue-800"></div>
            <span className="lg:text-7xl sm:text-6xl text-3xl font-semibold text-blue-800">
              {timerSeconds}
            </span>
            <div className="relative h-2.5 w-2.5 sm:h-3 sm:w-3 -right-[6px] rounded-full bg-blue-800"></div>
          </div>
        </div>
      </div>
    ),
    [isActiveTimer, timerSeconds],
  )
}

export default TimerClock
