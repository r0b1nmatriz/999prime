import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CustomCursor } from "@/components/custom-cursor"
import { SplashScreen } from "@/components/splash-screen"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "999 Prime - Pioneering the Digital Frontier",
  description: "Discover how 999 Prime is revolutionizing technology with innovative solutions for the future.",
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <CustomCursor />
          <SplashScreen />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
