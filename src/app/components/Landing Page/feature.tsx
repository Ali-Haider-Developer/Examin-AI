"use client";

import React, { useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';
import { FaGraduationCap, FaRobot, FaFileAlt, FaUserAlt, FaCog, FaChalkboardTeacher, FaChartBar, FaArrowRight, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import THEME from "./theme";

const FeatureSection = () => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  // Function to get icon component based on feature
  const getFeatureIcon = (iconName: string) => {
    switch(iconName) {
      case 'roles': return <FaGraduationCap className="text-3xl text-[#00fff7] neon-glow" />;
      case 'ai': return <FaRobot className="text-3xl text-[#ff00ea] neon-glow" />;
      case 'formats': return <FaFileAlt className="text-3xl text-[#1a0066] neon-glow" />;
      case 'profile': return <FaUserAlt className="text-3xl text-[#7f00ff] neon-glow" />;
      case 'customize': return <FaCog className="text-3xl text-[#ff00ea] neon-glow" />;
      case 'grading': return <FaChalkboardTeacher className="text-3xl text-[#00fff7] neon-glow" />;
      case 'results': return <FaChartBar className="text-3xl text-[#7f00ff] neon-glow" />;
      default: return <FaGraduationCap className="text-3xl text-[#00fff7] neon-glow" />;
    }
  };

  const features = [
    {
      title: "Role-Specific Experiences",
      description: "Tailored interfaces for students and teachers, allowing each user to engage in a way that suits their unique educational goals.",
      icon: "roles",
      color: "from-[#00fff7] to-[#7f00ff]"
    },
    {
      title: "AI-Powered Exam Creation",
      description: "Upload documents, select question formats, and let our advanced AI generate personalized exams in seconds.",
      icon: "ai",
      color: "from-[#ff00ea] to-[#00fff7]"
    },
    {
      title: "Multiple Content Formats",
      description: "Support for books, PDFs, videos, and topics. Create comprehensive exams from diverse learning materials.",
      icon: "formats",
      color: "from-[#1a0066] to-[#00fff7]"
    },
    {
      title: "Personalized Student Profiles",
      description: "Students create detailed profiles with academic interests and skill levels for tailor-made exam experiences.",
      icon: "profile",
      color: "from-[#7f00ff] to-[#ff00ea]"
    },
    {
      title: "Customizable Exam Parameters",
      description: "Set difficulty levels, time limits, and marking schemes to create exams that perfectly match your requirements.",
      icon: "customize",
      color: "from-[#ff00ea] to-[#00fff7]"
    },
    {
      title: "Smart, Automated Grading",
      description: "Our AI grading engine provides quick, consistent evaluations with instant feedback and personalized insights.",
      icon: "grading",
      color: "from-[#00fff7] to-[#1a0066]"
    },
    {
      title: "Detailed Analytics & Feedback",
      description: "Comprehensive performance insights and targeted recommendations to help students improve continuously.",
      icon: "results",
      color: "from-[#7f00ff] to-[#00fff7]"
    }
  ];

  const displayedFeatures = showAllFeatures ? features : features.slice(0, 3);

  // Animation for feature cards
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set visible after component mounts for animations
    setIsVisible(true);

    // Optional: Add intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('features-section');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <section id="features-section" className="py-20 px-4 md:px-8 text-center relative overflow-hidden" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#00fff7]/20 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#ff00ea]/20 rounded-full opacity-40 blur-3xl"></div>
      </div>

      {/* Section header */}
      <div className="relative z-10 max-w-5xl mx-auto mb-16">
        <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-[#00fff7]/20 to-[#ff00ea]/20 rounded-full">
          <p className="text-sm font-medium text-[#00fff7]">Advanced Level</p>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent drop-shadow-lg">
          Innovative Features
        </h2>
        <p className="text-lg md:text-xl text-[#e0e0ff] max-w-3xl mx-auto">
          ExaminAI combines advanced, cutting-edge AI technology with a modern neon interface to empower educators and students. Experience next-level customization, instant exam generation, and deep analytics—all in a beautiful, intuitive platform.
        </p>
        {/* Decorative line */}
        <div className="w-24 h-1.5 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] rounded-full mx-auto mt-8"></div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
        {displayedFeatures.map((feature, index) => (
          <Tilt
            key={index}
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            glareEnable={true}
            glareMaxOpacity={0.1}
            glareColor="rgba(255, 255, 255, 0.5)"
            glarePosition="all"
            className={`transform transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }`}
            style={{
              transitionDelay: `${index * 100}ms`
            }}
          >
            <div className="h-full bg-[#1a0066]/90 rounded-2xl shadow-xl overflow-hidden border-2 border-[#00fff7] hover:shadow-2xl transition-all duration-300 group">
              {/* Card header with gradient */}
              <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>

              <div className="p-8">
                {/* Icon with gradient background */}
                <div className="mb-6 relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-20 rounded-full blur-md transform group-hover:scale-110 transition-transform duration-300`}></div>
                  <div className="w-16 h-16 rounded-full bg-[#050014] border-2 border-[#00fff7] shadow-md flex items-center justify-center relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                    {getFeatureIcon(feature.icon)}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-[#00fff7] group-hover:text-[#ff00ea] transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Divider */}
                <div className={`w-12 h-1 bg-gradient-to-r ${feature.color} rounded-full mb-4 transform origin-left group-hover:scale-x-150 transition-transform duration-300`}></div>

                {/* Description */}
                <p className="text-[#e0e0ff]">
                  {feature.description}
                </p>

                {/* Learn more link */}
                <div className="mt-6 flex justify-end">
                  <a href="#" className="text-sm font-medium text-[#00fff7] flex items-center opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    Learn more <FaArrowRight className="ml-1 text-xs" />
                  </a>
                </div>
              </div>
            </div>
          </Tilt>
        ))}
      </div>

      {/* Show More / Show Less Button with enhanced styling */}
      <div className="mt-12 relative z-10">
        <button
          onClick={() => setShowAllFeatures(!showAllFeatures)}
          className="group relative overflow-hidden px-8 py-3 rounded-full bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black font-bold border-2 border-[#00fff7] shadow-lg hover:from-[#ff00ea] hover:to-[#00fff7] hover:scale-105 transition-all duration-300"
        >
          <span className="relative z-10 flex items-center">
            {showAllFeatures ? "Show Less" : "Explore All Features"}
            {showAllFeatures ? (
              <FaArrowUp className="ml-2 group-hover:-translate-y-1 transition-transform duration-300" />
            ) : (
              <FaArrowDown className="ml-2 group-hover:translate-y-1 transition-transform duration-300" />
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff00ea] to-[#00fff7] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </section>
  );
};

export default FeatureSection;
