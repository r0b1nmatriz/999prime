import { Zap, Globe, Shield, Cpu } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Zap className="h-10 w-10 text-purple-500" />,
      title: "Lightning McApps",
      description:
        "Our technology delivers unparalleled speed and efficiency for your digital to IRL needs.",
    },
    {
      icon: <Globe className="h-10 w-10 text-cyan-400" />,
      title: "VR & AR Revolution",
      description:
        "Connect and expand your presence across the digital landscape without boundaries.",
    },
    {
      icon: <Shield className="h-10 w-10 text-purple-500" />,
      title: "Tight & Secure",
      description:
        "Your privacy, Safety & Security is our prior promise. Trust me, Our Technology is Built for it.",
    },
    {
      icon: <Cpu className="h-10 w-10 text-cyan-400" />,
      title: "Future-Ready",
      description:
        "Coping to evolve with emerging technologies, Digitally & Cosmically.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pioneering the Digital Frontier
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover how 999Prime is revolutionizing technology with innovative
            solutions for the future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
