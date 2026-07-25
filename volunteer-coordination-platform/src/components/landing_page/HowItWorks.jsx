import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, 
  Sparkles, 
  Search, 
  Heart, 
  ShieldCheck, 
  FilePlus, 
  BarChart3 
} from "lucide-react";

// Data arrays
const volunteerSteps = [
  {
    title: "Create an Account",
    desc: "Sign up in seconds and tell us a little bit about what you love to do.",
    icon: UserPlus,
  },
  {
    title: "Meet Your AI Sidekick",
    desc: "Our AI looks at your unique skills and gently highlights the roles where you'll shine brightest.",
    icon: Sparkles,
  },
  {
    title: "Explore Activities",
    desc: "Browse heartwarming community activities right in your area.",
    icon: Search,
  },
  {
    title: "Raise Your Hand",
    desc: "Apply with a single click to the causes that move you, and get instant, encouraging feedback on how your skills align.",
    icon: Heart,
  },
];

const organizerSteps = [
  {
    title: "Set Up Camp",
    desc: "Create your organizer profile and get ready to welcome your future team.",
    icon: UserPlus,
  },
  {
    title: "Keep It Safe",
    desc: "A quick, friendly verification check keeps our volunteering community secure and trusted.",
    icon: ShieldCheck,
  },
  {
    title: "Share Your Mission",
    desc: "Post your upcoming activities easily using our simple, stress-free form.",
    icon: FilePlus,
  },
  {
    title: "Friendly AI Insights",
    desc: "No robotic rejection letters here. Our AI highlights great-fit volunteers and explains why they’re an awesome match, leaving the final shoutout up to you.",
    icon: Sparkles,
  },
  {
    title: "See the Good Grow",
    desc: "Watch your impact flourish through a friendly, easy-to-read dashboard that celebrates your team's hard work.",
    icon: BarChart3,
  },
];

export default function HowItWorks() {
  const [activeRole, setActiveRole] = useState("volunteer");
  const steps = activeRole === "volunteer" ? volunteerSteps : organizerSteps;

  return (
    <section id="how-it-works" className="bg-purple-200 py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="font-sora text-4xl font-extrabold uppercase text-purple-600 tracking-wide">
            How It Works
          </h2>
          <p className="mt-4 text-base max-w-xl mx-auto text-purple-50 font-inter leading-relaxed">
            Whether you're looking to volunteer or coordinate community
            initiatives, getting started takes just a few simple steps.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-28">
          <div className="flex bg-purple-50 rounded-xl p-1 shadow-inner relative z-10">
            <button
              onClick={() => setActiveRole("volunteer")}
              className={`px-6 py-2 rounded-lg font-sora text-sm font-bold transition-all cursor-pointer ${
                activeRole === "volunteer"
                  ? "bg-purple-600 text-purple-50 shadow-md"
                  : "text-purple-600 hover:text-purple-300"
              }`}
            >
              Volunteer
            </button>
            <button
              onClick={() => setActiveRole("organizer")}
              className={`px-6 py-2 rounded-lg font-sora text-sm font-bold transition-all cursor-pointer ${
                activeRole === "organizer"
                  ? "bg-purple-600 text-purple-50 shadow-md"
                  : "text-purple-600 hover:text-purple-300"
              }`}
            >
              Organizer
            </button>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeRole}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center relative"
            >
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                // Alternates positioning to fill visual voids
                const isTopText = index % 2 !== 0;

                return (
                  <div
                    key={step.title}
                    className="relative flex flex-col items-center flex-1 w-full mb-16 md:mb-0"
                  >
                    
                    {/* Top Content Slot */}
                    <div className="h-32 flex items-end justify-center mb-6 w-full px-4">
                      {isTopText ? (
                        <div className="text-center max-w-xs">
                          <h4 className="font-sora font-bold text-purple-600 text-md mb-1">{step.title}</h4>
                          <p className="font-inter text-xs text-purple-50 leading-relaxed">{step.desc}</p>
                        </div>
                      ) : (
                        <div className="p-3 bg-purple-50 rounded-full text-purple-600 shadow-sm border border-purple-300/30">
                          <IconComponent className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Central Node & Connecting Wave */}
                    <div className="flex items-center w-full relative justify-center">
                      <div className="w-12 h-12 rounded-full bg-purple-600 text-purple-50 font-sora font-extrabold text-base flex items-center justify-center z-10 shadow-md border-4 border-purple-200">
                        {index + 1}
                      </div>

                      {/* Wavy Path Segment */}
                      {index !== steps.length - 1 && (
                        <div className="hidden md:block absolute top-1/2 left-1/2 w-full h-16 -translate-y-1/2 pointer-events-none z-0">
                          <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                            <path
                              d={index % 2 === 0 ? "M 0 20 C 30 40, 70 0, 100 20" : "M 0 20 C 30 0, 70 40, 100 20"}
                              fill="none"
                              stroke="#A78BFA"
                              strokeWidth="3"
                              strokeDasharray="6 6"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Bottom Content Slot */}
                    <div className="h-32 flex items-start justify-center mt-6 w-full px-4">
                      {!isTopText ? (
                        <div className="text-center max-w-xs">
                          <h4 className="font-sora font-bold text-purple-600 text-md mb-1">{step.title}</h4>
                          <p className="font-inter text-xs text-purple-50 leading-relaxed">{step.desc}</p>
                        </div>
                      ) : (
                        <div className="p-3 bg-purple-50 rounded-full text-purple-600 shadow-sm border border-purple-300/30">
                          <IconComponent className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}