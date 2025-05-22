
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function SplashScreen() {
  const [progress, setProgress] = useState(13)
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsAnimatingOut(true)
            return 100
          }
          return Math.min(prev + 2, 100)
        })
      }, 20)

      return () => clearInterval(interval)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isAnimatingOut) {
      const timeout = setTimeout(() => setIsVisible(false), 600)
      return () => clearTimeout(timeout)
    }
  }, [isAnimatingOut])

  if (!isVisible) return null

  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black",
      "transition-opacity duration-500",
      isAnimatingOut ? "opacity-0" : "opacity-100"
    )}>
      <div className="w-80 space-y-8">
        <div className="relative h-24 mb-8">
          <Image
            src="/images/999prime-logo.png"
            alt="999 Prime"
            fill
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-gray-800">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-full"
            style={{ 
              width: '200%',
              transform: `translateX(${progress - 100}%)`,
              transition: 'transform 0.3s ease-out',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s linear infinite'
            }}
          />
        </div>
        <p className="text-sm text-center font-mono text-gray-400">
          <span className="inline-block animate-pulse">compiling...</span>
        </p>
      </div>
      <style jsx>{`
        @keyframes shimmer {
          from { background-position: 200% 0; }
          to { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}
