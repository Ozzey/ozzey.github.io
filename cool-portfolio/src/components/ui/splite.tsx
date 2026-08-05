'use client'

import { Suspense, lazy, useState, type MouseEventHandler } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleMove: MouseEventHandler<HTMLDivElement> = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setOffset({ x: x * 20, y: y * 20 })
  }

  const handleLeave: MouseEventHandler<HTMLDivElement> = () => {
    setOffset({ x: 0, y: 0 })
  }

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      <div className="w-full h-full" onMouseMove={handleMove} onMouseLeave={handleLeave}>
        <div
          className="w-full h-full transition-transform duration-150 ease-out"
          style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
        >
          <Spline
            scene={scene}
            className={className}
          />
        </div>
      </div>
    </Suspense>
  )
}
