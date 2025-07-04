'use client'

import React from 'react'
import { FaMoon, FaStar, FaArrowRight, FaRobot, FaBrain, FaDatabase, FaRocket } from 'react-icons/fa'
import { FaRobot as FaRobotSolid } from 'react-icons/fa6'
import Link from 'next/link'
import technavyaLogo from "public/technavya-logo.png";

const LunarStudioCTA = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-[#050014] text-[#e0e0ff]">
      {/* Background with gradient and stars */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0066] to-[#050014] z-0">
        {/* Stars */}
        {Array.from({ length: 50 }).map((_, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-[#00fff7]"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `pulse ${Math.random() * 3 + 2}s infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Moon decoration - reduced blur */}
      <div className="absolute top-1/2 -right-20 transform -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-[#7f00ff] to-[#ff00ea] opacity-10 blur-lg"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Technavya AI Logo and Badge */}
          <div className="flex flex-col items-center mb-12">
            <img src="/image.png" alt="Technavya AI Logo" className="w-20 h-20 mb-4 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 16px #00fff7)' }} />
            <div className="inline-block px-4 py-1 bg-[#1a0066] rounded-full mb-4">
              <p className="text-sm font-medium text-[#00fff7] flex items-center">
                Technavya AI - Empowering businesses with AI solutions
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent">
              Powered by <span className="bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent">Technavya AI</span>
            </h2>
            <p className="text-lg text-[#e0e0ff] text-center max-w-3xl mb-8">
              Technavya AI specializes in creating intelligent agentic AI solutions that transform how businesses operate. Our autonomous AI agents work independently to solve complex problems.
            </p>

            {/* Decorative line */}
            <div className="w-24 h-1 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] rounded-full mx-auto"></div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <FaRobot className="text-[#00fff7] neon-glow" />,
                title: "Agentic AI Solutions",
                description: "Autonomous AI agents that can understand, plan, and execute complex tasks with minimal human intervention."
              },
              {
                icon: <FaBrain className="text-[#ff00ea] neon-glow" />,
                title: "Cognitive Computing",
                description: "Advanced AI systems that mimic human thought processes to solve complex problems and make decisions."
              },
              {
                icon: <FaDatabase className="text-[#7f00ff] neon-glow" />,
                title: "Intelligent Automation",
                description: "AI-powered automation that adapts and learns from data to continuously improve processes."
              }
            ].map((service, index) => (
              <div
                key={index}
                className="bg-[#0a003d] rounded-2xl p-8 border border-[#1a0066] hover:bg-[#1a0066] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00fff7] to-[#ff00ea] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-[#ff00ea] mb-3">{service.title}</h3>
                <p className="text-[#e0e0ff] mb-6">{service.description}</p>
                <a href="https://technavya-ai.site/" className="text-[#00fff7] flex items-center text-sm font-medium group-hover:text-[#ff00ea] transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                  Learn more <FaArrowRight className="ml-2 text-xs group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <a
              href="https://technavya-ai.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black font-bold shadow-lg neon-glow hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center">
                Explore Technavya AI
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#7f00ff] to-[#ff00ea] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </a>
            <p className="mt-4 text-[#e0e0ff] text-sm">
              Discover how Technavya AI solutions can transform your business
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LunarStudioCTA
