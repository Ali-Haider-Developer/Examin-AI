"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaUser,
  FaUpload,
  FaCog,
  FaLaptop,
  FaCheckCircle,
  FaArrowRight,
  FaRobot,
  FaChartLine,
  FaBrain,
  FaGraduationCap,
  FaClipboardCheck
} from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  const svgPathRef = useRef<SVGPathElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const iconsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Animate SVG path
    if (svgPathRef.current) {
      gsap.fromTo(
        svgPathRef.current,
        { strokeDasharray: 500, strokeDashoffset: 500 },
        {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: svgPathRef.current,
            start: "top 75%",
            end: "bottom 25%",
            scrub: true,
          },
        }
      );
    }

    // Animate steps
    stepsRef.current.forEach((step, index) => {
      if (step) {
        gsap.fromTo(
          step,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: step,
              start: "top 80%",
              once: true,
            },
          }
        );
      }
    });

    // Animate icons
    iconsRef.current.forEach((icon) => {
      if (icon) {
        gsap.to(icon, {
          scale: 1.2,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
        });
      }
    });
  }, []);

  const steps = [
    {
      title: "Intelligent Profile Creation",
      description:
        "Our AI analyzes your academic profile and learning preferences to create a personalized learning experience tailored to your unique needs.",
      icon: <FaUser className="text-[#00fff7] neon-glow" />,
      color: "from-[#00fff7] to-[#7f00ff]"
    },
    {
      title: "Advanced Content Processing",
      description:
        "Upload any learning material - PDFs, videos, articles, or topics - and our AI engine will extract key concepts and knowledge structures.",
      icon: <FaUpload className="text-[#ff00ea] neon-glow" />,
      color: "from-[#ff00ea] to-[#00fff7]"
    },
    {
      title: "Agentic Exam Generation",
      description:
        "Our autonomous AI agents craft sophisticated, personalized exams that adapt to your learning style and academic objectives.",
      icon: <FaRobot className="text-[#7f00ff] neon-glow" />,
      color: "from-[#7f00ff] to-[#ff00ea]"
    },
    {
      title: "Adaptive Assessment Experience",
      description:
        "Take your exam in an intuitive interface that adapts in real-time to your responses, providing a truly personalized assessment.",
      icon: <FaLaptop className="text-[#00fff7] neon-glow" />,
      color: "from-[#00fff7] to-[#ff00ea]"
    },
    {
      title: "Comprehensive Analytics & Insights",
      description:
        "Receive detailed performance analytics and personalized improvement strategies powered by our advanced AI feedback system.",
      icon: <FaChartLine className="text-[#ff00ea] neon-glow" />,
      color: "from-[#ff00ea] to-[#00fff7]"
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden bg-[#050014]">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#7f00ff]/30 rounded-full opacity-40 blur-lg"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#00fff7]/30 rounded-full opacity-40 blur-lg"></div>
      </div>

      {/* Section header */}
      <div className="relative z-10 max-w-5xl mx-auto mb-20 text-center px-4">
        <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-[#1a0066] to-[#ff00ea] rounded-full">
          <p className="text-sm font-medium text-[#00fff7]">Seamless Experience</p>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent">
          How ExaminAI Works
        </h2>
        <p className="text-lg md:text-xl text-[#e0e0ff] max-w-3xl mx-auto">
          Our agentic AI platform transforms the assessment process through intelligent automation and personalized learning experiences.
        </p>

        {/* Decorative line */}
        <div className="w-24 h-1.5 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] rounded-full mx-auto mt-8"></div>
      </div>

      {/* Process steps - desktop version */}
      <div className="hidden md:block relative max-w-6xl mx-auto px-4">
        {/* Animated Path */}
        <svg width="100%" height="120" className="absolute top-1/2 left-0 transform -translate-y-1/2">
          <path
            ref={svgPathRef}
            d="M20,60 C150,20 300,100 450,60 S600,20 750,60 S900,100 1050,60"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeDasharray="8,8"
            fill="none"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>

        <div className="flex justify-between relative z-10">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center w-52">
              <div
                ref={(el) => {
                  stepsRef.current[index] = el;
                }}
                className="flex flex-col items-center text-center"
              >
                <div
                  ref={(el) => {
                    iconsRef.current[index] = el;
                  }}
                  className={`flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${step.color} shadow-lg mb-6`}
                >
                  {step.icon}
                </div>
                <div className="bg-[#0a003d] rounded-xl shadow-lg p-6 border border-[#1a0066] h-64 flex flex-col">
                  <h3 className="text-xl font-bold text-[#ff00ea] mb-3">
                    {step.title}
                  </h3>
                  <div className={`w-12 h-1 bg-gradient-to-r ${step.color} rounded-full mb-4`}></div>
                  <p className="text-[#e0e0ff] text-sm flex-grow">
                    {step.description}
                  </p>
                  <div className="mt-4 flex justify-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1a0066] text-[#00fff7] font-bold">
                      {index + 1}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process steps - mobile version */}
      <div className="md:hidden relative max-w-md mx-auto px-4">
        <div className="flex flex-col space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start">
              <div
                className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${step.color} text-white text-xl shadow-lg mr-4`}
              >
                {step.icon}
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 flex-grow">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <div className={`w-12 h-1 bg-gradient-to-r ${step.color} rounded-full mb-3`}></div>
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="relative z-10 text-center mt-16">
        <a
          href="/signup"
          className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group"
        >
          Get Started Now
          <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </a>
      </div>
    </section>
  );
};

export default HowItWorks;
