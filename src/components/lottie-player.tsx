import { useEffect, useRef } from 'react'

import lottie, { AnimationItem } from 'lottie-web'

type IProps = {
  loop: boolean
  path: string
}

export default function LottiePlayer(props: IProps) {
  const animationContainer = useRef<HTMLDivElement | null>(null)
  const animationInstance = useRef<AnimationItem | null>(null)

  useEffect(() => {
    if (animationContainer.current && !animationInstance.current) {
      animationInstance.current = lottie.loadAnimation({
        container: animationContainer.current as Element,
        renderer: 'svg',
        loop: props.loop,
        autoplay: true,
        path: props.path,
      })
    }

    return () => {
      if (animationInstance.current) {
        animationInstance.current.destroy()
        animationInstance.current = null
      }
    }
  }, [props.loop, props.path])

  return <div ref={animationContainer}></div>
}
