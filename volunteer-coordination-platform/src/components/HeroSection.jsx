import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroBg from "../assets/heroBg.svg";
import heart1 from "../assets/heart1.svg";
import heart2 from "../assets/heart2.svg";
import heart3 from "../assets/heart3.svg";

const hearts = [
  {
    src: heart1,
    top: "46%",
    left: "55%",
    size: 50,
    duration: "5.5s",
    delay: "0s",
    drift: "10px",
    spin: "-6deg",
  },
  {
    src: heart2,
    top: "55%",
    left: "68%",
    size: 60,
    duration: "4.8s",
    delay: "0.6s",
    drift: "14px",
    spin: "5deg",
  },
  {
    src: heart3,
    top: "44%",
    left: "81%",
    size: 70,
    duration: "6.2s",
    delay: "1.1s",
    drift: "9px",
    spin: "-4deg",
  },
];

const phrases = [
  ["Bring Your", "Passion"],
  ["Lend a Helping", "Hand"],
  ["Share a Little", "Sunshine"],
];

export default function HeroSection() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Floating hearts */}
      {hearts.map((heart, i) => (
        <img
          key={i}
          src={heart.src}
          alt=""
          aria-hidden="true"
          className="absolute z-10 pointer-events-none select-none float-heart"
          style={{
            top: heart.top,
            left: heart.left,
            width: heart.size,
            height: "auto",
            "--float-duration": heart.duration,
            "--float-delay": heart.delay,
            "--float-drift": heart.drift,
            "--float-spin": heart.spin,
          }}
        />
      ))}

      {/* Hero body */}
      <div className="flex flex-1 items-center px-64 pb-32 relative z-10">
        {/* Left column */}
        <div className="flex flex-col justify-center gap-6 w-full max-w-md">
          <h1
            className="text-5xl font-extrabold uppercase tracking-wide text-purple-600 font-sora"
            style={{
              lineHeight: "1.15",
              minHeight: "2.3em", // reserves space for 2 lines so nothing jumps on swap
            }}
          >
            <span key={phraseIndex} className="block headline-rotate">
              {phrases[phraseIndex][0]}
              <br />
              {phrases[phraseIndex][1]}
            </span>
          </h1>

          <p
            className="text-sm leading-relaxed max-w-xs text-purple-600/75 font-inter"
          >
            Benevolentia brings together big-hearted volunteers and local organizers. 
            With a little help from friendly AI, we make it simple to team up, support 
            one another, and watch your community thrive.
          </p>

          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <Link to="/signup">
              <button
                className="px-7 py-3 rounded-md text-sm font-bold bg-purple-600 text-purple-300 font-sora
                           transition-all duration-200 hover:bg-purple-800
                           active:scale-95 cursor-pointer"
              >
                Join Now
              </button>
            </Link>

            <Link to="/activities">
              <button
                className="px-6 py-3 rounded-md text-sm font-bold border-2 border-purple-600 text-purple-600 font-sora bg-transparent
                           transition-all duration-200 hover:bg-purple-50
                           active:scale-95 cursor-pointer"
              >
                Explore activities
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating animation keyframes */}
      <style>{`
        @keyframes floatHeart {
          0%   { transform: translateY(0) rotate(0deg); }
          50%  { transform: translateY(calc(var(--float-drift) * -1)) rotate(var(--float-spin)); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes headlineRotate {
          0%   { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .headline-rotate {
            animation: headlineRotate 0.6s ease-out;
        }
        .float-heart {
          animation: floatHeart var(--float-duration) ease-in-out infinite;
          animation-delay: var(--float-delay);
        }
        @media (prefers-reduced-motion: reduce) {
          .float-heart {
            animation: none;
          }
          .headline-rotate {
            animation: none;}
        }
      `}</style>
    </section>
  );
}
