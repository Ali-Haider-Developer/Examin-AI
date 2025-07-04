"use client"
import { FC, useState } from "react";
import { FaRobot, FaLock, FaChartLine, FaPlug, FaUserGraduate, FaChalkboardTeacher, FaGlobe, FaDatabase } from "react-icons/fa";

interface FAQ {
  question: string;
  answer: string;
  icon: React.ReactNode;
  category: 'technology' | 'security' | 'usage' | 'integration';
}

const faqs: FAQ[] = [
  {
    question: "What makes ExaminAI's agentic approach different?",
    answer: "ExaminAI uses autonomous AI agents that can understand context, make decisions, and adapt to user needs without constant human intervention. Unlike traditional AI tools that follow fixed patterns, our agentic system continuously learns from interactions, improving its ability to generate relevant questions, provide personalized feedback, and adapt to different learning styles.",
    icon: <FaRobot />,
    category: 'technology'
  },
  {
    question: "How does the AI-powered exam creation work?",
    answer: "Our agentic AI system analyzes your course content and learning objectives to automatically generate relevant questions across different difficulty levels. The system uses advanced natural language processing to understand context, identify key concepts, and create questions that test true comprehension rather than mere memorization. You can customize parameters like question types, topics, and complexity to match your specific needs.",
    icon: <FaDatabase />,
    category: 'technology'
  },
  {
    question: "Is ExaminAI secure for conducting high-stakes exams?",
    answer: "Yes, ExaminAI implements enterprise-grade security measures including AI-powered proctoring, advanced plagiarism detection, and end-to-end encrypted data transmission to ensure exam integrity. Our system uses biometric authentication and continuous behavior analysis to verify student identities and prevent cheating, making it suitable for high-stakes assessments.",
    icon: <FaLock />,
    category: 'security'
  },
  {
    question: "How accurate is the AI grading system for subjective answers?",
    answer: "Our AI grading system has been trained on millions of exam responses and maintains a 99% accuracy rate compared to expert human graders. For subjective questions, it uses advanced natural language understanding and contextual analysis to evaluate responses based on content, reasoning, and relevance rather than just keywords. The system can recognize different approaches to solving problems and provides detailed feedback on strengths and areas for improvement.",
    icon: <FaChartLine />,
    category: 'technology'
  },
  {
    question: "Can I integrate ExaminAI with my existing educational technology stack?",
    answer: "Yes, ExaminAI offers seamless integration with major LMS platforms including Canvas, Blackboard, and Moodle through our comprehensive API. We also support SSO authentication, grade passback, and content synchronization with most educational technology platforms. Our dedicated integration team can assist with custom implementations for specialized systems.",
    icon: <FaPlug />,
    category: 'integration'
  },
  {
    question: "How does ExaminAI adapt to different learning styles?",
    answer: "ExaminAI's agentic system builds a comprehensive profile of each student's learning patterns, strengths, and areas for improvement. It then tailors question types, difficulty progression, and feedback style to match individual learning preferences. The system continuously refines its approach based on student performance and engagement metrics, creating a truly personalized assessment experience.",
    icon: <FaUserGraduate />,
    category: 'usage'
  },
  {
    question: "What support does ExaminAI provide for educators?",
    answer: "Educators receive comprehensive analytics dashboards, automated grading assistance, and content generation tools that significantly reduce administrative workload. Our system provides insights into class performance patterns, identifies knowledge gaps, and suggests targeted interventions. We also offer professional development resources and a dedicated support team to help educators maximize the platform's capabilities.",
    icon: <FaChalkboardTeacher />,
    category: 'usage'
  },
  {
    question: "Is ExaminAI available in multiple languages?",
    answer: "Yes, ExaminAI currently supports over 40 languages with full functionality, including question generation, grading, and feedback. Our natural language processing capabilities are optimized for each supported language to ensure accuracy and cultural relevance. We regularly add new languages based on user demand and educational needs across different regions.",
    icon: <FaGlobe />,
    category: 'usage'
  }
];

const FAQSection: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = activeCategory
    ? faqs.filter(faq => faq.category === activeCategory)
    : faqs;

  const categories = [
    { id: 'technology', label: 'Technology', icon: <FaRobot /> },
    { id: 'security', label: 'Security', icon: <FaLock /> },
    { id: 'usage', label: 'Usage', icon: <FaUserGraduate /> },
    { id: 'integration', label: 'Integration', icon: <FaPlug /> }
  ];

  return (
    <section id="faq" className="relative py-24 overflow-hidden bg-[#050014]">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#7f00ff]/30 rounded-full opacity-40 blur-lg"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#00fff7]/30 rounded-full opacity-40 blur-lg"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="max-w-5xl mx-auto mb-16 text-center">
          <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-[#1a0066] to-[#ff00ea] rounded-full">
            <p className="text-sm font-medium text-[#00fff7]">Knowledge Base</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#e0e0ff] max-w-3xl mx-auto">
            Discover how our agentic AI platform transforms assessment creation, grading, and learning experiences.
          </p>

          {/* Decorative line */}
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] rounded-full mx-auto mt-8"></div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center ${
              activeCategory === null
                ? 'bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black shadow-md neon-glow'
                : 'bg-[#0a003d] text-[#e0e0ff] border border-[#1a0066] hover:border-[#00fff7] hover:bg-[#1a0066]'
            }`}
            onClick={() => setActiveCategory(null)}
          >
            All Questions
          </button>

          {categories.map(category => (
            <button
              key={category.id}
              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black shadow-md neon-glow'
                  : 'bg-[#0a003d] text-[#e0e0ff] border border-[#1a0066] hover:border-[#00fff7] hover:bg-[#1a0066]'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ items */}
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#0a003d] rounded-xl shadow-md border border-[#1a0066] overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div
                className="flex items-center p-6 cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-gradient-to-r
                  ${faq.category === 'technology' ? 'from-[#00fff7] to-[#7f00ff]' : ''}
                  ${faq.category === 'security' ? 'from-[#ff00ea] to-[#00fff7]' : ''}
                  ${faq.category === 'usage' ? 'from-[#7f00ff] to-[#ff00ea]' : ''}
                  ${faq.category === 'integration' ? 'from-[#00fff7] to-[#ff00ea]' : ''}
                  text-black neon-glow
                `}>
                  {faq.icon}
                </div>

                <h3 className="text-lg font-bold text-[#ff00ea] flex-grow pr-8">{faq.question}</h3>

                <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-[#1a0066] transition-transform duration-300 ${
                  openIndex === index ? "bg-[#7f00ff]/20 rotate-180" : "bg-[#050014]"
                }`}>
                  <svg
                    className={`h-4 w-4 text-[#00fff7]`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  openIndex === index
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 pt-2 text-[#e0e0ff] border-t border-[#1a0066]">
                  <p className="leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-16 text-center">
          <p className="text-[#e0e0ff] mb-4">Still have questions?</p>
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black font-bold shadow-md neon-glow hover:scale-105 transition-all duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
