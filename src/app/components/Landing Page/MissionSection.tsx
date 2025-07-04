"use client"
import React from 'react';

const MissionSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#050014] to-[#1a0066] text-[#e0e0ff] py-8 px-6 flex flex-col md:flex-row items-center md:justify-between">
      {/* Animated Background Waves */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="w-full h-full bg-gradient-to-r from-transparent to-[#00fff7] opacity-20 animate-wave"></div>
        <div className="w-full h-full bg-gradient-to-r from-[#ff00ea] to-transparent opacity-10 animate-wave reverse-wave"></div>
      </div>

      {/* Text Content */}
      <div 
        className="relative z-10 max-w-md text-center md:text-left opacity-0 translate-x-[-50px] animate-[slideInFromLeft_0.8s_ease-out_forwards]"
      >
        <h2 className="text-[#00fff7] text-sm font-semibold mb-2">Our Mission</h2>
        <h1 className="text-2xl font-bold mb-3 text-[#ff00ea]">Implementation of Agentic AI in Exams</h1>
        <p className="text-sm leading-relaxed">
          Our mission at ExaminAI is to leverage Agentic AI to create personalized,
          adaptive exams that enhance efficiency, fairness, and student success through
          automated exam creation, grading, and feedback.
        </p>
      </div>

      {/* Image */}
      <div 
        className="relative z-10 mt-6 md:mt-0 md:ml-8 flex-shrink-0 opacity-0 translate-x-[50px] animate-[slideInFromRight_0.8s_ease-out_forwards]"
      >
        <img
          src="/mission.png"
          alt="Illustrative image"
          className="w-full max-w-sm h-auto object-contain hover:scale-105 transition-transform duration-300 border-4 border-[#00fff7] rounded-2xl"
        />
      </div>

      {/* Inline CSS */}
      <style jsx>{`
        @keyframes wave {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes reverseWave {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        @keyframes slideInFromLeft {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-wave {
          animation: wave 10s linear infinite;
        }

        .reverse-wave {
          animation: reverseWave 12s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default MissionSection;
