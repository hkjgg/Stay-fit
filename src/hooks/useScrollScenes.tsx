import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useScroll, type MotionValue } from 'framer-motion'
import { SCENE_WRAPPER_VH } from '../lib/constants'

interface ScrollSceneContextValue {
  progress: MotionValue<number>
  wrapperRef: React.RefObject<HTMLDivElement | null>
}

const ScrollSceneContext = createContext<ScrollSceneContextValue | null>(null)

export function ScrollSceneProvider({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  })

  return (
    <ScrollSceneContext.Provider value={{ progress: scrollYProgress, wrapperRef }}>
      <div ref={wrapperRef} style={{ height: `${SCENE_WRAPPER_VH}vh` }} className="relative">
        {children}
      </div>
    </ScrollSceneContext.Provider>
  )
}

export function useScrollScene() {
  const ctx = useContext(ScrollSceneContext)
  if (!ctx) throw new Error('useScrollScene must be used within ScrollSceneProvider')
  return ctx
}
