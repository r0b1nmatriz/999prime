"use client"

import { useRef, useEffect, useState } from "react"

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  let particles: Array<{
    x: number
    y: number
    baseX: number
    baseY: number
    size: number
    color: string
    scatteredColor: string
    life: number
  }> = []
  let imageData: ImageData | null = null
  let imageBounds: { x: number; y: number; width: number; height: number } | null = null
  let animationFrameId: number

  const createParticle = () => {
    if (!imageData || !imageBounds) return null

    const data = imageData.data

    for (let attempt = 0; attempt < 100; attempt++) {
      // Random position within image bounds
      const relX = Math.floor(Math.random() * imageBounds.width)
      const relY = Math.floor(Math.random() * imageBounds.height)

      // Get pixel data
      const pixelIndex = (relY * imageData.width + relX) * 4

      // Check if pixel is part of the logo (alpha > 50)
      if (pixelIndex < data.length && data[pixelIndex + 3] > 50) {
        // Get absolute position
        const x = imageBounds.x + relX
        const y = imageBounds.y + relY

        // Get color
        const r = data[pixelIndex]
        const g = data[pixelIndex + 1]
        const b = data[pixelIndex + 2]

        // Create metallic effect for scattered particles
        const silverColor = `rgb(${180 + Math.random() * 75}, ${180 + Math.random() * 75}, ${180 + Math.random() * 75})`

        return {
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * 1.5 + 0.5,
          color: `rgb(${r}, ${g}, ${b})`,
          scatteredColor: silverColor,
          life: Math.random() * 100 + 50,
        }
      }
    }

    return null
  }

  const animate = () => {
    if (!canvasRef.current || !canvasRef.current.getContext("2d")) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Get mouse position
    const mouseX = mousePositionRef.current.x
    const mouseY = mousePositionRef.current.y
    const maxDistance = isMobile ? 180 : 300

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      // Calculate distance to mouse
      const dx = mouseX - p.x
      const dy = mouseY - p.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Apply force if mouse is close
      if (distance < maxDistance && (isTouchingRef.current || !("ontouchstart" in window))) {
        const force = (maxDistance - distance) / maxDistance
        const angle = Math.atan2(dy, dx)
        const moveX = Math.cos(angle) * force * 60
        const moveY = Math.sin(angle) * force * 60

        p.x = p.baseX - moveX
        p.y = p.baseY - moveY
        ctx.fillStyle = p.scatteredColor
      } else {
        // Return to original position
        p.x += (p.baseX - p.x) * 0.1
        p.y += (p.baseY - p.y) * 0.1
        ctx.fillStyle = p.color
      }

      // Draw particle
      ctx.fillRect(p.x, p.y, p.size, p.size)

      // Update life and replace if needed
      p.life--
      if (p.life <= 0) {
        const newParticle = createParticle()
        if (newParticle) {
          particles[i] = newParticle
        } else {
          particles.splice(i, 1)
          i--
        }
      }
    }

    // Maintain particle count
    const targetParticleCount = Math.floor(
      (isMobile ? 5000 : 9000) * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)),
    )
    while (particles.length < targetParticleCount) {
      const newParticle = createParticle()
      if (newParticle) particles.push(newParticle)
    }

    // Continue animation
    animationFrameId = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Update canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setIsMobile(window.innerWidth < 768)
    }
    updateCanvasSize()

    // Load and process the image
    const loadImage = () => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = "/images/999prime-logo.png"

        img.onload = () => {
          if (!ctx || !canvas) {
            reject(new Error("Canvas context not available"))
            return
          }

          setImageLoaded(true)

          // Calculate dimensions
          const logoHeight = isMobile ? 160 : 240
          const aspectRatio = img.width / img.height
          const logoWidth = logoHeight * aspectRatio

          // Position the logo in the center
          const x = Math.floor(canvas.width / 2 - logoWidth / 2)
          const y = Math.floor(canvas.height / 2 - logoHeight / 2)
          const width = Math.ceil(logoWidth)
          const height = Math.ceil(logoHeight)

          // Draw the image
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, x, y, width, height)

          // Get image data
          try {
            const safeX = Math.max(0, Math.min(x, canvas.width - 1))
            const safeY = Math.max(0, Math.min(y, canvas.height - 1))
            const safeWidth = Math.max(1, Math.min(width, canvas.width - safeX))
            const safeHeight = Math.max(1, Math.min(height, canvas.height - safeY))

            imageData = ctx.getImageData(safeX, safeY, safeWidth, safeHeight)
            imageBounds = { x: safeX, y: safeY, width: safeWidth, height: safeHeight }

            // Clear the canvas after getting the data
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            resolve()
          } catch (error) {
            reject(error)
          }
        }

        img.onerror = () => {
          reject(new Error("Failed to load image"))
        }
      })
    }

    // Create initial particles
    const createInitialParticles = () => {
      if (!imageData || !imageBounds) return

      const baseCount = isMobile ? 5000 : 9000
      const count = Math.floor(baseCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)))

      for (let i = 0; i < count; i++) {
        const particle = createParticle()
        if (particle) particles.push(particle)
      }
    }

    // Initialize everything
    const init = async () => {
      try {
        await loadImage()
        particles = []
        createInitialParticles()
        animate()
      } catch (error) {
        console.error("Initialization error:", error)
      }
    }

    init()

    // Event handlers
    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current = { x: event.clientX, y: event.clientY }
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        event.preventDefault()
        mousePositionRef.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        }
      }
    }

    const handleTouchStart = () => {
      isTouchingRef.current = true
    }

    const handleTouchEnd = () => {
      isTouchingRef.current = false
      mousePositionRef.current = { x: 0, y: 0 }
    }

    const handleMouseLeave = () => {
      if (!("ontouchstart" in window)) {
        mousePositionRef.current = { x: 0, y: 0 }
      }
    }

    const handleResize = () => {
      cancelAnimationFrame(animationFrameId)
      updateCanvasSize()

      // Reinitialize after resize
      setTimeout(() => {
        init().catch((error) => {
          console.error("Resize error:", error)
        })
      }, 50)
    }

    // Add event listeners
    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false })
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("touchstart", handleTouchStart)
    canvas.addEventListener("touchend", handleTouchEnd)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchend", handleTouchEnd)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isMobile])

  useEffect(() => {
    const handleOrientationChange = () => {
      setTimeout(() => {
        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext("2d")
          if (ctx) {
            const updateCanvasSize = () => {
              canvas.width = window.innerWidth
              canvas.height = window.innerHeight
            }
            updateCanvasSize()
            const init = async () => {
              try {
                const img = new Image()
                img.crossOrigin = "anonymous"
                img.src = "/images/999prime-logo.png"
                await new Promise<void>((resolve, reject) => {
                  img.onload = () => resolve()
                  img.onerror = () => reject(new Error("Failed to load image"))
                })
                const baseCount = window.innerWidth < 768 ? 5000 : 9000
                const count = Math.floor(baseCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)))
                particles = []
                for (let i = 0; i < count; i++) {
                  const particle = createParticle()
                  if (particle) particles.push(particle)
                }
                animate()
              } catch (error) {
                console.error("Initialization error:", error)
              }
            }
            init().catch(console.error)
          }
        }
      }, 100)
    }

    window.addEventListener("orientationchange", handleOrientationChange)
    return () => window.removeEventListener("orientationchange", handleOrientationChange)
  }, [])

  return (
    <div className="relative w-full h-dvh flex flex-col items-center justify-center bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute top-0 left-0 touch-none"
        aria-label="Interactive particle effect with 999 Prime logo"
      />
      <div className="absolute bottom-[100px] text-center z-10">
        <p className="font-mono text-gray-400 text-xs sm:text-base md:text-sm">
          <span className="text-gray-300 hover:text-silver-400 transition-colors duration-300">999 Prime</span>{" "}
          <span className="transition-colors duration-300">Interactive Experience</span>
        </p>
      </div>
    </div>
  )
}
