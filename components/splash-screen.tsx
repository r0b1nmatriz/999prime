
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function SplashScreen() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsLoaded(true)
            return 100
          }
          return prev + (100 - prev) * 0.08
        })
      }, 50)
      return () => clearInterval(interval)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      const timeout = setTimeout(() => setIsVisible(false), 600)
      return () => clearTimeout(timeout)
    }
  }, [isLoaded])

  if (!isVisible) return null

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col items-center justify-center bg-black",
      "transition-opacity duration-500",
      isLoaded ? "opacity-0" : "opacity-100"
    )}>
      <div className="w-80 space-y-8">
        <div className="relative h-24 mb-8">
          <Image
            src="/images/999prime-logo.png"
            alt="999 Prime"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-gray-800">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 rounded-full"
            style={{ 
              width: '200%',
              transform: `translateX(${progress - 100}%)`,
              transition: 'transform 0.3s ease-out',
              animation: 'shimmer 2s linear infinite'
            }}
          />
        </div>
        <style jsx>{`
          @keyframes shimmer {
            from { background-position: 200% 0; }
            to { background-position: -200% 0; }
          }
        `}</style>
        <p className="text-sm text-center font-mono text-gray-400">
          <span className="inline-block animate-pulse">compiling...</span>
        </p>
      </div>
    </div>
  )
}
