"use client"

import { useRef, useEffect, useState } from "react"
import { AWS_LOGO_PATH } from "./aws-logo-path"

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setIsMobile(window.innerWidth < 768) // Set mobile breakpoint
    }

    updateCanvasSize()

    let particles: {
      x: number
      y: number
      baseX: number
      baseY: number
      size: number
      color: string
      scatteredColor: string
      life: number
      isAWS: boolean
    }[] = []

    let textImageBounds: { x: number; y: number; width: number; height: number } | null = null

    let textImageData: ImageData | null = null

    function createTextImage() {
      if (!ctx || !canvas) return 0

      // Clear the canvas first
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "white"
      ctx.save()

      const logoHeight = isMobile ? 80 : 150 // Increased from 60/120
      const vercelLogoWidth = logoHeight * (40 / 19.7762) // Maintain aspect ratio
      const awsLogoWidth = logoHeight * (283 / 140) // Maintain aspect ratio
      const logoSpacing = isMobile ? 40 : 80 // Increased from 30/60
      const totalWidth = vercelLogoWidth + awsLogoWidth + logoSpacing

      // Calculate the drawing area
      const drawX = Math.floor(canvas.width / 2 - totalWidth / 2)
      const drawY = Math.floor(canvas.height / 2 - logoHeight / 2)
      const drawWidth = Math.ceil(totalWidth)
      const drawHeight = Math.ceil(logoHeight)

      // Ensure we have valid dimensions before drawing
      if (drawWidth <= 0 || drawHeight <= 0 || canvas.width <= 0 || canvas.height <= 0) {
        return 0
      }

      ctx.translate(drawX, drawY)

      // Draw Vercel logo
      ctx.save()
      const vercelScale = logoHeight / 19.7762
      ctx.scale(vercelScale, vercelScale)
      ctx.beginPath()
      ctx.moveTo(23.3919, 0)
      ctx.lineTo(32.9188, 0)
      ctx.bezierCurveTo(36.7819, 0, 39.9136, 3.13165, 39.9136, 6.99475)
      ctx.lineTo(39.9136, 16.0805)
      ctx.lineTo(36.0006, 16.0805)
      ctx.lineTo(36.0006, 6.99475)
      ctx.bezierCurveTo(36.0006, 6.90167, 35.9969, 6.80925, 35.9898, 6.71766)
      ctx.lineTo(26.4628, 16.079)
      ctx.bezierCurveTo(26.4949, 16.08, 26.5272, 16.0805, 26.5595, 16.0805)
      ctx.lineTo(36.0006, 16.0805)
      ctx.lineTo(36.0006, 19.7762)
      ctx.lineTo(26.5595, 19.7762)
      ctx.bezierCurveTo(22.6964, 19.7762, 19.4788, 16.6139, 19.4788, 12.7508)
      ctx.lineTo(19.4788, 3.68923)
      ctx.lineTo(23.3919, 3.68923)
      ctx.lineTo(23.3919, 12.7508)
      ctx.bezierCurveTo(23.3919, 12.9253, 23.4054, 13.0977, 23.4316, 13.2668)
      ctx.lineTo(33.1682, 3.6995)
      ctx.bezierCurveTo(33.0861, 3.6927, 33.003, 3.68923, 32.9188, 3.68923)
      ctx.lineTo(23.3919, 3.68923)
      ctx.lineTo(23.3919, 0)
      ctx.closePath()

      ctx.moveTo(13.7688, 19.0956)
      ctx.lineTo(0, 3.68759)
      ctx.lineTo(5.53933, 3.68759)
      ctx.lineTo(13.6231, 12.7337)
      ctx.lineTo(13.6231, 3.68759)
      ctx.lineTo(17.7535, 3.68759)
      ctx.lineTo(17.7535, 17.5746)
      ctx.bezierCurveTo(17.7535, 19.6705, 15.1654, 20.6584, 13.7688, 19.0956)
      ctx.closePath()

      ctx.fill()
      ctx.restore()

      // Draw AWS logo
      ctx.save()
      ctx.translate(vercelLogoWidth + logoSpacing, 0)
      const awsScale = logoHeight / 140
      ctx.scale(awsScale, awsScale)
      const path = new Path2D(AWS_LOGO_PATH)
      ctx.fill(path)
      ctx.restore()

      ctx.restore()

      // Only get image data from the area where we drew the logos
      // Make sure the dimensions are valid and within the canvas bounds
      const safeX = Math.max(0, Math.min(drawX, canvas.width - 1))
      const safeY = Math.max(0, Math.min(drawY, canvas.height - 1))
      const safeWidth = Math.max(1, Math.min(drawWidth, canvas.width - safeX))
      const safeHeight = Math.max(1, Math.min(drawHeight, canvas.height - safeY))

      try {
        textImageData = ctx.getImageData(safeX, safeY, safeWidth, safeHeight)
        // Store the drawing area for reference when creating particles
        textImageBounds = { x: safeX, y: safeY, width: safeWidth, height: safeHeight }
      } catch (e) {
        console.error("Error getting image data:", e)
        return 0
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      return Math.max(vercelScale, awsScale)
    }

    function createParticle(scale: number) {
      if (!ctx || !canvas || !textImageData || !textImageBounds) return null

      const data = textImageData.data

      for (let attempt = 0; attempt < 100; attempt++) {
        // Generate random position within the bounds of where we drew the logos
        const relativeX = Math.floor(Math.random() * textImageBounds.width)
        const relativeY = Math.floor(Math.random() * textImageBounds.height)

        // Get the pixel index in the image data array
        const pixelIndex = (relativeY * textImageData.width + relativeX) * 4

        // Check if this pixel is part of the logo (has alpha > 128)
        if (pixelIndex < data.length && data[pixelIndex + 3] > 128) {
          // Convert relative position to absolute canvas position
          const x = textImageBounds.x + relativeX
          const y = textImageBounds.y + relativeY

          const logoHeight = isMobile ? 80 : 150
          const vercelLogoWidth = logoHeight * (40 / 19.7762)
          const awsLogoWidth = logoHeight * (283 / 140)
          const logoSpacing = isMobile ? 40 : 80
          const totalWidth = vercelLogoWidth + awsLogoWidth + logoSpacing
          const centerX = canvas.width / 2

          // Determine if this particle is part of the AWS logo based on its x position
          const isAWSLogo = x >= centerX - totalWidth / 2 + vercelLogoWidth + logoSpacing

          return {
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            size: Math.random() * 1 + 0.5,
            color: "white",
            scatteredColor: isAWSLogo ? "#FF9900" : "#00DCFF",
            isAWS: isAWSLogo,
            life: Math.random() * 100 + 50,
          }
        }
      }

      return null
    }

    function createInitialParticles(scale: number) {
      const baseParticleCount = isMobile ? 5000 : 9000 // Adjusted from fixed 7000
      const particleCount = Math.floor(baseParticleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)))
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle(scale)
        if (particle) particles.push(particle)
      }
    }

    let animationFrameId: number

    function animate(scale: number) {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const { x: mouseX, y: mouseY } = mousePositionRef.current
      const maxDistance = isMobile ? 180 : 300 // Increased from 240 fixed value

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance && (isTouchingRef.current || !("ontouchstart" in window))) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          const moveX = Math.cos(angle) * force * 60
          const moveY = Math.sin(angle) * force * 60
          p.x = p.baseX - moveX
          p.y = p.baseY - moveY

          ctx.fillStyle = p.scatteredColor
        } else {
          p.x += (p.baseX - p.x) * 0.1
          p.y += (p.baseY - p.y) * 0.1
          ctx.fillStyle = "white"
        }

        ctx.fillRect(p.x, p.y, p.size, p.size)

        p.life--
        if (p.life <= 0) {
          const newParticle = createParticle(scale)
          if (newParticle) {
            particles[i] = newParticle
          } else {
            particles.splice(i, 1)
            i--
          }
        }
      }

      const baseParticleCount = isMobile ? 5000 : 9000
      const targetParticleCount = Math.floor(
        baseParticleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)),
      )
      while (particles.length < targetParticleCount) {
        const newParticle = createParticle(scale)
        if (newParticle) particles.push(newParticle)
      }

      animationFrameId = requestAnimationFrame(() => animate(scale))
    }

    const scale = createTextImage()
    createInitialParticles(scale)
    animate(scale)

    const handleResize = () => {
      cancelAnimationFrame(animationFrameId)
      updateCanvasSize()

      // Small delay to ensure canvas is properly resized before drawing
      setTimeout(() => {
        const newScale = createTextImage()
        particles = []
        createInitialParticles(newScale)
        animate(newScale)
      }, 50)
    }

    const handleMove = (x: number, y: number) => {
      mousePositionRef.current = { x, y }
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault() // Ensure touch events are properly handled
      if (e.touches.length > 0) {
        e.preventDefault()
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
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

    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false })
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("touchstart", handleTouchStart)
    canvas.addEventListener("touchend", handleTouchEnd)

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

  return (
    <div className="relative w-full h-dvh flex flex-col items-center justify-center bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute top-0 left-0 touch-none"
        aria-label="Interactive particle effect with Vercel and AWS logos"
      />
      <div className="absolute bottom-[100px] text-center z-10">
        <p className="font-mono text-gray-400 text-xs sm:text-base md:text-sm ">
          Join the{" "}
          <a
            href="https://vercel.fyi/v0-reinvent"
            target="_blank"
            className="invite-link text-gray-300 hover:text-cyan-400 transition-colors duration-300"
            rel="noreferrer"
          >
            v0 Happy Hour
          </a>{" "}
          <span>at</span>
          <span className="transition-colors duration-300"> aws re:invent</span> <br />
          <a
            href="https://v0.dev/chat/RqstUbkUVcB?b=b_BoU5qmQ0ehp"
            className="text-gray-500 text-xs mt-2.5 inline-block"
            target="_blank"
            rel="noreferrer"
          >
            (fork this v0)
          </a>
          <style>{`
            a.invite-link:hover + span + span {
              color: #FF9900;
            }
          `}</style>
        </p>
      </div>
    </div>
  )
}
