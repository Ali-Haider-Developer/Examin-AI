"use client";
import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { FaUser, FaGraduationCap, FaChalkboardTeacher, FaArrowRight, FaLightbulb, FaRocket } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import { API_BASE_URL } from '@/utils/apiConfig';
import LandingBackground from "./LandingBackground";
import THEME from "./theme";

const Home: NextPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Check if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    setIsLoggedIn(!!token);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Instead of returning null, show a loading state
  if (!isMounted) {
    return (
      <div className="relative text-white min-h-screen flex items-center justify-center overflow-hidden">
        <div className="fixed inset-0 animate-gradient" style={{
          background: "linear-gradient(-45deg, #0f4c29, #1a8d5f, #115740, #34b37c)",
          backgroundSize: "400% 400%",
          zIndex: -2
        }}></div>
        <div className="relative z-10">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Function to render floating particles
  const renderParticles = () => {
    return Array.from({ length: 30 }).map((_, index) => (
      <div
        key={index}
        className="absolute rounded-full bg-white opacity-20"
        style={{
          width: `${Math.random() * 8 + 2}px`,
          height: `${Math.random() * 8 + 2}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 10 + 10}s linear infinite`,
          animationDelay: `${Math.random() * 5}s`
        }}
      />
    ));
  };

  // Function to render floating geometric shapes
  const renderGeometricShapes = () => {
    const shapes = [
      'rounded-full', // Circle
      'rounded-none rotate-45', // Diamond (square rotated)
      'rounded-none', // Square
      'rounded-tl-3xl rounded-br-3xl', // Custom shape 1
      'rounded-tr-3xl rounded-bl-3xl', // Custom shape 2
      'rounded-t-3xl', // Half pill top
      'rounded-b-3xl', // Half pill bottom
      'rounded-l-3xl', // Half pill left
      'rounded-r-3xl', // Half pill right
    ];

    return Array.from({ length: 15 }).map((_, index) => {
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = Math.random() * 60 + 20;
      const isCircle = randomShape === 'rounded-full';

      return (
        <div
          key={index}
          className={`absolute ${randomShape} bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-3xl border border-white/10`}
          style={{
            width: isCircle ? `${size}px` : `${size}px`,
            height: isCircle ? `${size}px` : `${size}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 20 + 20}s linear infinite, spin-slow ${Math.random() * 30 + 30}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.3 + 0.1,
          }}
        />
      );
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ color: THEME.text }}>
      {/* 3D Animated Background */}
      <LandingBackground />
      {/* Animated Background with enhanced blacklight gradient */}
      <div className="fixed inset-0 animate-gradient" style={{
        background: THEME.gradient,
        backgroundSize: "400% 400%",
        zIndex: -2
      }}></div>

      {/* Decorative elements - neon blacklight */}
      <div className="fixed top-20 left-20 w-80 h-80 rounded-full" style={{ background: THEME.accent2, opacity: 0.3, filter: 'blur(32px)' }}></div>
      <div className="fixed bottom-20 right-20 w-96 h-96 rounded-full" style={{ background: THEME.accent1, opacity: 0.2, filter: 'blur(32px)' }}></div>

      {/* Animated particles */}
      <div className="fixed inset-0 z-0">
        {renderParticles()}
      </div>

      {/* Geometric shapes */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {renderGeometricShapes()}
      </div>

      {/* Background pattern overlay */}
      <div className="fixed inset-0 bg-[url('/noise.png')] opacity-5 z-0"></div>

      {/* Glass overlay - minimal blur */}
      <div className="fixed inset-0 backdrop-blur-[2px] z-0"></div>

      {/* Animated gradient lines */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent animate-pulse-slow"></div>
        <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navbar with glass effect */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-gradient-to-r from-[#00fff7]/80 to-[#ff00ea]/80 shadow-lg'
            : 'bg-gradient-to-r from-[#1a0066]/80 to-[#050014]/80'
        } border-b-2 border-[#00fff7] backdrop-blur-lg`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <div className="absolute inset-0 bg-white rounded-full blur-sm opacity-20 animate-pulse-slow"></div>
                  <img className="h-12 w-12 relative z-10" src="https://cdn-icons-png.flaticon.com/128/23/23358.png" alt="Logo" />
                </div>
                <div className="ml-3">
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent">
                    ExaminAI
                  </span>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-1">
                  {[
                    { name: "Home", href: "#" },
                    { name: "Features", href: "#features" },
                    { name: "How It Works", href: "#how-it-works" },
                    { name: "Testimonials", href: "#testimonials" },
                    { name: "Contact", href: "#contact" }
                  ].map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-[#e0e0ff] hover:text-black px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-[#00fff7] hover:to-[#ff00ea] mx-1 border-2 border-transparent hover:border-[#00fff7]"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-4">
                {isLoggedIn ? (
                  <button
                    onClick={() => window.location.href = '/Profile'}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[#00fff7] to-[#ff00ea] hover:from-[#ff00ea] hover:to-[#00fff7] text-black font-bold border-2 border-[#00fff7] shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <FaUser className="text-black" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => window.location.href = '/login'}
                      className="bg-[#1a0066]/80 border-2 border-[#00fff7] text-[#e0e0ff] px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gradient-to-r hover:from-[#00fff7] hover:to-[#ff00ea] hover:text-black transition-all duration-300"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => window.location.href = '/signup'}
                      className="bg-gradient-to-r from-[#00fff7] to-[#1a8d5f] text-black font-bold border-2 border-[#00fff7] px-6 py-2.5 rounded-full text-sm shadow-lg hover:from-[#1a8d5f] hover:to-[#00fff7] hover:scale-105 transition-all duration-300"
                    >
                      Join as Student
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-full text-[#e0e0ff] hover:bg-gradient-to-r hover:from-[#00fff7] hover:to-[#ff00ea] focus:outline-none border-2 border-[#00fff7] transition-colors duration-300"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden transition-all duration-300 transform">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-r from-[#00fff7]/80 to-[#ff00ea]/80">
              {[
                { name: "Home", href: "#" },
                { name: "Features", href: "#features" },
                { name: "How It Works", href: "#how-it-works" },
                { name: "Testimonials", href: "#testimonials" },
                { name: "Contact", href: "#contact" }
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-[#e0e0ff] hover:text-black block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-gradient-to-r hover:from-[#00fff7] hover:to-[#ff00ea] border-2 border-transparent hover:border-[#00fff7]"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 space-y-2">
                {isLoggedIn ? (
                  <button onClick={() => window.location.href = '/Profile'} className="w-full flex items-center justify-center bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black font-bold border-2 border-[#00fff7] px-4 py-2 rounded-full text-sm hover:from-[#ff00ea] hover:to-[#00fff7] transition-all duration-300">
                    <FaUser className="mr-2" /> Profile
                  </button>
                ) : (
                  <>
                    <button onClick={() => window.location.href = '/Login'} className="w-full text-center bg-[#1a0066]/80 border-2 border-[#00fff7] text-[#e0e0ff] px-4 py-2 rounded-full text-sm font-medium hover:bg-gradient-to-r hover:from-[#00fff7] hover:to-[#ff00ea] hover:text-black transition-all duration-300">
                      Login
                    </button>
                    <button onClick={() => window.location.href = '/signup'} className="w-full text-center bg-gradient-to-r from-[#00fff7] to-[#1a8d5f] text-black font-bold border-2 border-[#00fff7] px-4 py-2 rounded-full text-sm hover:from-[#1a8d5f] hover:to-[#00fff7] transition-all duration-300">
                      Join as Student
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between relative z-10 max-w-6xl pt-32 pb-20">
        {/* Text Section with enhanced animations */}
        <div className="text-center lg:text-left max-w-3xl animate-fadeIn">
          {/* Animated badge */}
          <div className="inline-block mb-6 px-6 py-2 bg-white/10 rounded-full border border-white/20 shadow-lg relative overflow-hidden group">
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/30 to-emerald-500/0 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-1000 animate-gradient"></div>

            <p className="text-sm font-medium text-emerald-200 flex items-center relative z-10">
              <FaRocket className="mr-2 animate-pulse-slow" />
              <span className="relative">
                AI-Powered Education Platform
                <span className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></span>
              </span>
            </p>
          </div>

          {/* Animated heading with 3D effect */}
          <div className="relative">
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent inline-block transform transition-transform duration-300 hover:translate-y-[-2px] hover:scale-[1.01]">
                Transform Education with
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent inline-block transform transition-transform duration-300 hover:translate-y-[-2px] hover:scale-[1.02]">
                ExaminAI
              </span>
            </h1>

            {/* 3D shadow effect */}
            <div className="absolute -bottom-4 left-0 w-full h-8 bg-gradient-to-b from-emerald-500/10 to-transparent blur-lg opacity-50 lg:block hidden"></div>
          </div>

          <h2 className="text-xl lg:text-2xl text-emerald-100/90 mt-8 font-medium leading-relaxed">
            Generate personalized exams, receive instant feedback, and revolutionize your learning experience
          </h2>

          {/* Feature list with enhanced animations */}
          <div className="mt-10 space-y-5 max-w-xl">
            {[
              {
                icon: <FaLightbulb className="text-xs text-white" />,
                text: "Upload any learning material and generate customized exams in seconds",
                delay: "0s"
              },
              {
                icon: <FaLightbulb className="text-xs text-white" />,
                text: "Receive detailed feedback and performance analytics to improve your learning",
                delay: "0.2s"
              },
              {
                icon: <FaLightbulb className="text-xs text-white" />,
                text: "Customize exam parameters to match your specific educational needs",
                delay: "0.4s"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 transform opacity-0 translate-y-4 animate-[fadeIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: feature.delay }}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 flex items-center justify-center shadow-md shadow-emerald-500/20 animate-pulse-slow" style={{ animationDelay: `${index * 0.5}s` }}>
                    {feature.icon}
                  </div>
                </div>
                <p className="text-white/80">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          {/* CTA buttons with enhanced effects */}
          <div className="mt-12 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            {isLoggedIn ? (
              <button
                onClick={() => window.location.href = '/DashBoard'}
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-400 text-white py-4 px-8 rounded-full font-medium shadow-lg hover:shadow-emerald-500/50 transition-all duration-300"
              >
                {/* Animated glow effect */}
                <div className="absolute inset-0 w-1/3 h-full bg-white/20 skew-x-[-45deg] transform -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000"></div>

                <span className="relative z-10 flex items-center justify-center">
                  Go to Dashboard
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            ) : (
              <>
                <button
                  onClick={() => window.location.href = '/signup?role=student'}
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-400 text-white py-4 px-8 rounded-full font-medium shadow-lg hover:shadow-emerald-500/50 transition-all duration-300"
                >
                  {/* Animated glow effect */}
                  <div className="absolute inset-0 w-1/3 h-full bg-white/20 skew-x-[-45deg] transform -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000"></div>

                  <span className="relative z-10 flex items-center justify-center">
                    <FaGraduationCap className="mr-2" />
                    Join as Student
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>

                <button
                  onClick={() => window.location.href = '/signup?role=teacher'}
                  className="group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white py-4 px-8 rounded-full font-medium transition-all duration-300 hover:bg-white/20"
                >
                  {/* Animated border effect */}
                  <div className="absolute inset-0 rounded-full border border-white/30 opacity-0 group-hover:opacity-100 scale-[1.05] group-hover:scale-[1.15] transition-all duration-500"></div>

                  <span className="relative z-10 flex items-center justify-center">
                    <FaChalkboardTeacher className="mr-2" />
                    Join as Teacher
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6">
            <p className="text-white/60 text-sm">Trusted by educators worldwide</p>
            {['Harvard', 'Stanford', 'MIT', 'Oxford'].map((uni, index) => (
              <div
                key={index}
                className="text-white/40 text-sm font-medium flex items-center"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></div>
                {uni}
              </div>
            ))}
          </div>
        </div>

        {/* 3D Image Section with enhanced effects */}
        <div className="relative mt-16 lg:mt-0 lg:ml-8 animate-fadeIn delay-400">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

          {/* Animated ring */}
          <div className="absolute inset-0 border-4 border-dashed border-emerald-500/20 rounded-full animate-spin-slow" style={{ animationDuration: '30s' }}></div>
          <div className="absolute inset-0 border-4 border-dashed border-teal-500/10 rounded-full animate-spin-reverse-slow" style={{ animationDuration: '20s' }}></div>

          {/* Floating grid dots */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-12 gap-3 w-full h-full animate-float">
              {Array.from({ length: 96 }).map((_, index) => (
                <div
                  key={index}
                  className="w-1.5 h-1.5 bg-white/30 rounded-full"
                />
              ))}
            </div>
          </div>

          {/* Main image with enhanced 3D effects */}
          <div className="relative z-10 transform hover:scale-105 transition-all duration-500 hover:rotate-1 perspective-1000">
            {/* 3D shadow */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl transform translate-y-4 scale-[0.95]"></div>

            {/* Image container with 3D effect */}
            <div className="relative group perspective-1000">
              {/* Reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

              <img
                src="/asd.png"
                alt="Illustration of ExaminieAI"
                className="relative z-10 h-auto max-w-md rounded-2xl shadow-2xl border border-white/10 transform group-hover:translate-z-10 transition-transform duration-500"
              />
            </div>

            {/* Floating badges with enhanced animations */}
            <div className="absolute -top-6 -right-6 bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
              <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 animate-pulse-slow"></div>
              <span className="relative z-10 flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                AI-Powered
              </span>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-teal-500 to-emerald-400 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 animate-pulse-slow"></div>
              <span className="relative z-10 flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                Instant Feedback
              </span>
            </div>

            {/* Additional floating badge */}
            <div className="absolute top-1/2 -right-10 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-indigo-400 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-float" style={{ animationDelay: '1s' }}>
              <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 animate-pulse-slow"></div>
              <span className="relative z-10 flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                Personalized
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden z-10">
        <svg className="relative block w-full h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0z"
            fill="rgba(255, 255, 255, 0.05)"
          ></path>
        </svg>
      </div>

      {/* Persistent Floating CTA */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => window.location.href = '/signup'}
          className="bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black font-bold px-8 py-4 rounded-full shadow-2xl border-4 border-[#1a0066] animate-pulse-slow hover:scale-105 transition-all duration-300 text-lg"
        >
          Try ExaminAI Now
        </button>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Home), {
  ssr: false
});
