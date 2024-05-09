'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import { randomPosition, randomSize } from '@/lib/utils'

const AnimatedBackground = (): JSX.Element => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const illustrations = Array.from({ length: 14 }, (_, i) =>
    require(`@/assets/ilustrations/ilustration_${i + 1}.webp`),
  )

  const duplicatedList = [...illustrations, ...illustrations, ...illustrations]

  const positions = duplicatedList.map((_, index) =>
    randomPosition(index, windowSize.width, windowSize.width),
  )

  return (
    <div className="fixed mt-24 h-full w-full opacity-20 transition-opacity duration-1000 ease-in-out">
      {duplicatedList.map((illustration, index) => {
        const delay = index * 100
        return (
          <div
            key={index}
            className={`absolute animate-pulse transition-all delay-${delay}`}
            style={{ top: positions[index].top, left: positions[index].left }}
          >
            <div style={randomSize()}>
              <Image
                src={illustration.default}
                alt={'element'}
                width={0}
                height={0}
                className="h-auto w-full"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AnimatedBackground
