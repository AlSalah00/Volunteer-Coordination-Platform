import { motion } from "framer-motion";
import { Handshake } from "lucide-react";
import SDGImg from "../../assets/SDG17.jpg";

export default function Mission() {
  return (
    <section id="mission" className="bg-purple-300 py-32 overflow-hidden relative">

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: UN SDG 17 Logo (4Cols) */}
          <motion.div 
            className="lg:col-span-5 flex justify-center"
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Playful graphic frame */}
            <div className="relative p-6 bg-purple-50 rounded-3xl shadow-xl border-4 border-purple-300/30 transform hover:rotate-2 transition-transform duration-300 cursor-pointer group">
              <div className="absolute -top-4 -right-4 bg-purple-600 text-purple-50 p-3 rounded-2xl shadow-md group-hover:scale-110 transition-transform">
                <Handshake className="w-6 h-6" />
              </div>
              
              {/* SDG17 logo */}
              <img 
                src={SDGImg}
                alt="UN Sustainable Development Goal 17 - Partnerships for the Goals" 
                className="w-full max-w-70 sm:max-w-[320px] h-auto rounded-xl object-contain mix-blend-multiply"
              />
            </div>
          </motion.div>

          {/* Right Column: Headline & Content (7Cols) */}
          <motion.div 
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div className="text-purple-600 text-xl font-sora font-extrabold uppercase tracking-widest">
              MISSION
            </div>

            <h3 className="font-sora text-3xl sm:text-4xl font-extrabold text-purple-600 leading-tight">
              Big Hearts, <br />
              <span className="text-purple-400">Joining Forces</span>
            </h3>

            <div className="font-inter text-purple-600/75 text-base space-y-4 leading-relaxed">
              <p>
                At <span className="font-semibold text-purple-600">Benevolentia</span>, we believe that the biggest challenges can't be solved alone. Real change happens when passionate people and local groups team up seamlessly.
              </p>
              <p>
                Inspired by the <span className="font-semibold text-purple-600">United Nations Sustainable Development Goal 17 (Partnerships for the Goals)</span>, our platform uses friendly AI to connect the dots and close coordination gaps. We're putting powerful tools into the hands of grassroots projects, turning everyday good intentions into lasting community impact.
              </p>
              <p className="font-medium text-purple-600 italic">
                Because true change isn't a solo effort, it's a collaborative milestone.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}