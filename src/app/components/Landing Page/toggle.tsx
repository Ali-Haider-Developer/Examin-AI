"use client";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { FaGraduationCap, FaChalkboardTeacher, FaBook, FaChartLine, FaClock, FaUsers, FaRobot, FaTools, FaFileAlt, FaChartBar } from 'react-icons/fa';

interface Benefit {
  text: string;
  icon: React.ReactNode;
}

interface BenefitsCardProps {
  title: string;
  benefits: Benefit[];
  icon: React.ReactNode;
  color: string;
  description: string;
}

const BenefitsCard = ({
  title,
  benefits,
  icon,
  color,
  description
}: BenefitsCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div
      className="relative overflow-hidden bg-[#0a003d] rounded-2xl shadow-xl border border-[#1a0066] w-full sm:w-[450px] transform transition-all duration-500 ease-in-out hover:shadow-2xl group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative gradient background */}
      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${color}`}></div>

      {/* Card header */}
      <div className="p-8 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r ${color} neon-glow shadow-lg transition-all duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#ff00ea]">{title}</h3>
            <p className="text-[#e0e0ff] text-sm">{description}</p>
          </div>
        </div>

        {/* Divider */}
        <div className={`w-16 h-1 bg-gradient-to-r ${color} rounded-full mb-6 transform origin-left transition-transform duration-300 ${isHovered ? 'scale-x-150' : 'scale-x-100'}`}></div>
      </div>

      {/* Benefits list */}
      <div className="px-8 pb-8">
        <ul className="space-y-4">
          {benefits.map((benefit, index) => (
            <li
              key={index}
              className="flex items-start transition-all duration-300 ease-in-out p-2 rounded-lg hover:bg-[#1a0066]/40"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r ${color} bg-opacity-10 text-[#00fff7] mr-3 transition-all duration-300 ${activeIndex === index ? 'scale-110 bg-opacity-20' : 'scale-100'}`}>
                {benefit.icon}
              </div>
              <p className="text-[#e0e0ff] font-medium">
                {benefit.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const RoleCards: React.FC = () => {
  const studentBenefits: Benefit[] = [
    {
      text: "Personalized learning paths tailored to your unique academic profile and learning style",
      icon: <FaGraduationCap className="text-[#00fff7] neon-glow" />
    },
    {
      text: "AI-generated practice exams that adapt to your strengths and areas for improvement",
      icon: <FaBook className="text-[#ff00ea] neon-glow" />
    },
    {
      text: "Detailed performance analytics with actionable insights to accelerate your progress",
      icon: <FaChartLine className="text-[#7f00ff] neon-glow" />
    },
    {
      text: "Efficient time management with adaptive learning schedules based on your progress",
      icon: <FaClock className="text-[#00fff7] neon-glow" />
    },
    {
      text: "Collaborative learning opportunities with AI-facilitated peer matching",
      icon: <FaUsers className="text-[#ff00ea] neon-glow" />
    }
  ];

  const teacherBenefits: Benefit[] = [
    {
      text: "Agentic AI assistants that automate exam creation, grading, and feedback generation",
      icon: <FaRobot className="text-[#7f00ff] neon-glow" />
    },
    {
      text: "Comprehensive analytics dashboard with insights into student performance patterns",
      icon: <FaChartBar className="text-[#00fff7] neon-glow" />
    },
    {
      text: "Customizable assessment tools that align with your specific teaching methodology",
      icon: <FaTools className="text-[#ff00ea] neon-glow" />
    },
    {
      text: "Automated content generation for diverse learning materials and resources",
      icon: <FaFileAlt className="text-[#7f00ff] neon-glow" />
    },
    {
      text: "Time-saving automation of administrative tasks to focus more on teaching",
      icon: <FaClock className="text-[#00fff7] neon-glow" />
    }
  ];

  return (
    <section id="benefits" className="relative py-24 overflow-hidden bg-[#050014]">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#7f00ff]/30 rounded-full opacity-40 blur-lg"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#00fff7]/30 rounded-full opacity-40 blur-lg"></div>
      </div>

      {/* Section header */}
      <div className="relative z-10 max-w-5xl mx-auto mb-16 text-center px-4">
        <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-[#1a0066] to-[#ff00ea] rounded-full">
          <p className="text-sm font-medium text-[#00fff7]">Tailored Experiences</p>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent">
          Benefits for Students & Teachers
        </h2>
        <p className="text-lg md:text-xl text-[#e0e0ff] max-w-3xl mx-auto">
          Our agentic AI platform delivers unique advantages for both students and educators, transforming the learning experience.
        </p>

        {/* Decorative line */}
        <div className="w-24 h-1.5 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] rounded-full mx-auto mt-8"></div>
      </div>

      <div className="relative z-10 flex flex-wrap gap-10 justify-center px-4">
        <BenefitsCard
          title="For Students"
          benefits={studentBenefits}
          icon={<FaGraduationCap className="text-2xl text-[#00fff7] neon-glow" />}
          color="from-[#00fff7] to-[#7f00ff]"
          description="Accelerate your learning journey with personalized AI assistance"
        />

        <BenefitsCard
          title="For Teachers"
          benefits={teacherBenefits}
          icon={<FaChalkboardTeacher className="text-2xl text-[#ff00ea] neon-glow" />}
          color="from-[#ff00ea] to-[#00fff7]"
          description="Transform your teaching with intelligent automation and insights"
        />
      </div>
    </section>
  );
};

export default RoleCards;
