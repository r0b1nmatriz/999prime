
"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export function SplashScreen() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setIsVisible(false), 500)
            return 100
          }
          return prev + 2
        })
      }, 20)
      return () => clearInterval(interval)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col items-center justify-center bg-black",
      "transition-opacity duration-500",
      progress === 100 ? "opacity-0" : "opacity-100"
    )}>
      <div className="w-64 space-y-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
            999 Prime
          </h2>
        </div>
        <Progress value={progress} className="h-1 bg-gray-800">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </Progress>
        <p className="text-sm text-center text-gray-400">Loading experience...</p>
      </div>
    </div>
  )
}
