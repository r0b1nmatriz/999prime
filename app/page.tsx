import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Innovation from "@/components/innovation"
import Testimonials from "@/components/testimonials"
import ContactCTA from "@/components/contact-cta"
import Footer from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <Features />
      <Innovation />
      <Testimonials />
      <ContactCTA />
      <Footer />
    </div>
  )
}
