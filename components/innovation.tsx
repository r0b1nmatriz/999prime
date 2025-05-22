import Image from "next/image"

export default function Innovation() {
  return (
    <section id="innovation" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Innovating for the Digital Future</h2>
            <p className="text-gray-300 mb-6">
              At 999Prime, we're not just adapting to the future—we're creating it. Our team of visionaries and
              technologists work at the intersection of imagination and possibility.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center mt-1">
                  <span className="text-xs font-bold">1</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">Quantum Computing Solutions</h3>
                  <p className="text-gray-400">
                    Harnessing the power of quantum mechanics to solve complex problems at unprecedented speeds.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-cyan-400 flex items-center justify-center mt-1">
                  <span className="text-xs font-bold text-black">2</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">Neural Interface Technology</h3>
                  <p className="text-gray-400">
                    Bridging the gap between human cognition and digital systems for intuitive interaction.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center mt-1">
                  <span className="text-xs font-bold">3</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">Sustainable Tech Ecosystems</h3>
                  <p className="text-gray-400">
                    Creating environmentally conscious technology that minimizes impact while maximizing performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-400/20 mix-blend-overlay z-10 rounded-2xl"></div>
            <Image
              src="/placeholder.svg?height=1080&width=1920"
              alt="Future technology visualization"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
