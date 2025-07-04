"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/SiderBar/page';
import { FaCheckCircle, FaQuestionCircle, FaClipboardList, FaHourglassHalf, FaTrophy, FaArrowRight } from 'react-icons/fa';
import THEME from "../components/Landing Page/theme";
import LandingBackground from "../components/Landing Page/LandingBackground";
import Image from "next/image";

const ExamTypeSelectionPage = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10);
  const [difficultyLevel, setDifficultyLevel] = useState<number>(3);
  const [isTimed, setIsTimed] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(60);
  const [marksPerQuestion, setMarksPerQuestion] = useState<number>(5);
  const [difficultyOptionsVisible, setDifficultyOptionsVisible] = useState<boolean>(false);
  const router = useRouter();

  const totalMarks = numberOfQuestions * marksPerQuestion;

  const getDifficultyString = (level: number) => {
    if (level === 1) return "easy";
    if (level === 3) return "medium";
    if (level === 5) return "hard";
    return "medium";
  };

  const getQuestionType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'MCQs': 'MCQ',
      'Short Questions': 'Short',
      'Long Questions': 'Essay',
      'Coding Problems': 'CodingProblem',
      'Case Studies': 'CaseStudy',
      'True/False': 'TrueFalse'
    };
    return typeMap[type] || type;
  };

  const handleTypeSelect = (type: string) => {
    console.log('Selected exam type:', type);
    setSelectedType(type);
    const examType = getQuestionType(type);
    localStorage.setItem('selectedExamType', examType)
  };

  const handleNextClick = () => {
    try {
      let selectedContentIds: any[] = [];
      try {
        const raw = localStorage.getItem('selected_content_ids');
        if (raw) {
          const parsed = JSON.parse(raw);
          selectedContentIds = Array.isArray(parsed) ? parsed : [parsed];
        }
      } catch (e) {
        // fallback to empty array if parsing fails
        selectedContentIds = [];
      }

      // Store exam parameters in localStorage
      const examParams = {
        selectedContentIds,
        examType: selectedType ? getQuestionType(selectedType) : "MCQ",
        numberOfQuestions,
        difficulty: getDifficultyString(difficultyLevel),
        isTimed,
        duration: isTimed ? duration : 60,
        marksPerQuestion,
        totalMarks,
        language: "english"
      };
      localStorage.setItem('examParameters', JSON.stringify(examParams));

      // Redirect to ExamGeneration page
      router.push('/ExamGenration');

    } catch (error) {
      console.error("Error storing exam parameters:", error);
    }
  };

  const handleDifficultyChange = async (level: number) => {
    console.log('Selected difficulty level:', level);
    setDifficultyLevel(level);
    setDifficultyOptionsVisible(false);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundImage = "linear-gradient(to left, rgba(72, 187, 120, 0.7), rgba(255, 255, 255, 0.8))";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundImage = "linear-gradient(to right, rgba(72, 187, 120, 0.5), rgba(255, 255, 255, 0.7))";
  };

  // Function to get icon based on exam type
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'MCQs': return <FaCheckCircle className="text-4xl mb-3 text-emerald-500" />;
      case 'Short Questions': return <FaQuestionCircle className="text-4xl mb-3 text-blue-500" />;
      case 'Long Questions': return <FaClipboardList className="text-4xl mb-3 text-purple-500" />;
      case 'Coding Problems': return <div className="text-4xl mb-3 text-amber-500">&#60;/&#62;</div>;
      case 'Case Studies': return <div className="text-4xl mb-3 text-pink-500">📊</div>;
      case 'True/False': return <div className="text-4xl mb-3 text-teal-500">✓/✗</div>;
      default: return <FaQuestionCircle className="text-4xl mb-3 text-gray-500" />;
    }
  };

  // Floating particles animation
  const renderParticles = () => {
    return Array.from({ length: 20 }).map((_, index) => (
      <div
        key={index}
        className="absolute rounded-full bg-gradient-to-r from-green-300 to-blue-300 opacity-30"
        style={{
          width: `${Math.random() * 20 + 5}px`,
          height: `${Math.random() * 20 + 5}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 10 + 10}s linear infinite`,
          animationDelay: `${Math.random() * 5}s`
        }}
      />
    ));
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-[240px]">
        <div className="relative flex flex-col items-center p-8 min-h-screen overflow-hidden" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
          {/* Animated Neon Background */}
          <LandingBackground />
          {/* Top Bar with Branding */}
          <div className="w-full flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Technavya AI Logo" width={40} height={40} style={{ filter: 'drop-shadow(0 0 8px #00fff7)' }} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff00ea] to-[#00fff7] bg-clip-text text-transparent">Exam Type Selection</h1>
            </div>
          </div>
          <header className="relative z-10 text-center mb-10 w-full max-w-4xl">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-transparent bg-clip-text mb-4 leading-tight tracking-tight">
                Design Your Perfect Exam
              </h1>
              <p className="text-[#e0e0ff] mt-4 text-lg max-w-2xl mx-auto">
                Customize your assessment experience by selecting the question format and tailoring parameters to match your educational objectives.
              </p>
              {/* Animated gradient line */}
              <div className="w-full max-w-xl mx-auto mt-6 h-1 bg-gradient-to-r from-[#00fff7] via-[#7f00ff] to-[#ff00ea] rounded-full"></div>
            </div>
          </header>
          {!selectedType ? (
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 justify-items-center">
              {/* Question Type Selection */}
              {['MCQs', 'Short Questions', 'Long Questions', 'Coding Problems', 'Case Studies', 'True/False'].map((type) => (
                <div
                  key={type}
                  className="p-6 w-80 h-56 max-w-full border-2 border-[#1a0066] rounded-2xl shadow-xl cursor-pointer flex flex-col justify-center items-center text-center transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 backdrop-blur-md bg-[#050014]/80 hover:border-[#00fff7]"
                  onClick={() => handleTypeSelect(type)}
                  style={{ boxShadow: `0 0 16px ${THEME.accent1}` }}
                >
                  {getTypeIcon(type)}
                  <h2 className="text-2xl font-semibold text-[#e0e0ff] mb-2">{type}</h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] rounded-full mx-auto mb-3"></div>
                  <p className="text-[#7f00ff] text-sm">Select to customize your {type.toLowerCase()}</p>
                </div>
              ))}
            </div>
          ) : (
            <section className="relative z-10 w-full max-w-4xl mx-auto bg-[#1a0066]/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border-2 border-[#00fff7]" style={{ boxShadow: `0 0 32px ${THEME.accent1}` }}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00fff7] to-[#ff00ea] flex items-center justify-center shadow-lg">
                  {getTypeIcon(selectedType)}
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-[#00fff7]">Customize Your {selectedType}</h3>
                  <p className="text-[#e0e0ff]">Fine-tune your exam parameters</p>
                </div>
              </div>
              <div className="space-y-8">
                {/* Number of Questions */}
                <div className="bg-[#050014]/80 p-6 rounded-xl shadow-lg border-2 border-[#1a0066]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaClipboardList className="text-[#00fff7] text-xl mr-3" />
                      <label className="text-lg font-medium text-[#e0e0ff]">Total Number of Questions</label>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-32 p-3 border-2 border-[#00fff7] rounded-lg shadow-sm focus:ring-2 focus:ring-[#00fff7] focus:border-[#00fff7] text-center font-medium text-[#e0e0ff] bg-[#1a0066]"
                        value={numberOfQuestions}
                        onChange={(e) => setNumberOfQuestions(+e.target.value)}
                        min={1}
                        max={100}
                      />
                      <div className="absolute -bottom-5 right-0 text-xs text-[#7f00ff]">Max: 100</div>
                    </div>
                  </div>
                </div>

                {/* Difficulty Level */}
                <div className="bg-[#050014]/80 p-6 rounded-xl shadow-lg border-2 border-[#1a0066]">
                  <div className="flex items-center mb-4">
                    <FaTrophy className="text-[#00fff7] text-xl mr-3" />
                    <label className="text-lg font-medium text-[#e0e0ff]">Difficulty Level</label>
                  </div>

                  {/* Difficulty options with improved styling */}
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {/* Easy Button */}
                    <button
                      onClick={() => handleDifficultyChange(1)}
                      className={`relative p-4 rounded-xl shadow-md transition-all duration-300 ${
                        difficultyLevel === 1
                          ? 'bg-gradient-to-r from-green-500 to-green-400 text-white transform scale-105'
                          : 'bg-white text-gray-700 hover:bg-green-50'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        {difficultyLevel === 1 && (
                          <FaCheckCircle className="absolute top-2 right-2 text-white text-sm" />
                        )}
                        <span className="text-2xl mb-1">🌱</span>
                        <span className="font-medium">Easy</span>
                      </div>
                    </button>

                    {/* Medium Button */}
                    <button
                      onClick={() => handleDifficultyChange(3)}
                      className={`relative p-4 rounded-xl shadow-md transition-all duration-300 ${
                        difficultyLevel === 3
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-white transform scale-105'
                          : 'bg-white text-gray-700 hover:bg-yellow-50'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        {difficultyLevel === 3 && (
                          <FaCheckCircle className="absolute top-2 right-2 text-white text-sm" />
                        )}
                        <span className="text-2xl mb-1">🌿</span>
                        <span className="font-medium">Medium</span>
                      </div>
                    </button>

                    {/* Hard Button */}
                    <button
                      onClick={() => handleDifficultyChange(5)}
                      className={`relative p-4 rounded-xl shadow-md transition-all duration-300 ${
                        difficultyLevel === 5
                          ? 'bg-gradient-to-r from-red-500 to-red-400 text-white transform scale-105'
                          : 'bg-white text-gray-700 hover:bg-red-50'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        {difficultyLevel === 5 && (
                          <FaCheckCircle className="absolute top-2 right-2 text-white text-sm" />
                        )}
                        <span className="text-2xl mb-1">🌳</span>
                        <span className="font-medium">Hard</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Time Limit */}
                <div className="bg-[#050014]/80 p-6 rounded-xl shadow-lg border-2 border-[#1a0066]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaHourglassHalf className="text-[#00fff7] text-xl mr-3" />
                      <label className="text-lg font-medium text-[#e0e0ff]">Time Limit</label>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isTimed}
                          onChange={() => {
                            console.log('Time limit toggled:', !isTimed);
                            setIsTimed(!isTimed);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">{isTimed ? 'Enabled' : 'Disabled'}</span>
                      </label>

                      {isTimed && (
                        <div className="relative">
                          <input
                            type="number"
                            className="w-32 p-3 border-2 border-[#00fff7] rounded-lg shadow-sm focus:ring-2 focus:ring-[#00fff7] focus:border-[#00fff7] text-center font-medium text-[#e0e0ff] bg-[#1a0066]"
                            value={duration}
                            onChange={(e) => {
                              console.log('Duration changed:', +e.target.value);
                              setDuration(+e.target.value);
                            }}
                            min={1}
                            max={180}
                          />
                          <div className="absolute -bottom-5 right-0 text-xs text-[#7f00ff]">Minutes</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Marks Per Question */}
                <div className="bg-[#050014]/80 p-6 rounded-xl shadow-lg border-2 border-[#1a0066]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaTrophy className="text-[#00fff7] text-xl mr-3" />
                      <label className="text-lg font-medium text-[#e0e0ff]">Marks per Question</label>
                    </div>
                    <input
                      type="number"
                      className="w-32 p-3 border-2 border-[#00fff7] rounded-lg shadow-sm focus:ring-2 focus:ring-[#00fff7] focus:border-[#00fff7] text-center font-medium text-[#e0e0ff] bg-[#1a0066]"
                      value={marksPerQuestion}
                      onChange={(e) => {
                        console.log('Marks per question changed:', +e.target.value);
                        setMarksPerQuestion(+e.target.value);
                      }}
                      min={1}
                    />
                  </div>
                </div>

                {/* Total Marks Display */}
                <div className="flex justify-center items-center my-8">
                  <div className="relative bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black text-3xl font-bold py-6 px-12 rounded-xl shadow-lg transform transition duration-200 hover:scale-105 overflow-hidden border-2 border-[#00fff7]" style={{ boxShadow: `0 0 16px ${THEME.accent1}` }}>
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                      <div className="absolute top-0 left-0 w-20 h-20 rounded-full bg-white opacity-20"></div>
                      <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-white opacity-20"></div>
                    </div>
                    <div className="relative z-10">
                      Total Marks: <span className="text-5xl ml-2">{totalMarks}</span>
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <div className="text-center mt-8">
                  <button
                    onClick={handleNextClick}
                    className="group relative bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black px-10 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-150 hover:scale-105 font-bold text-lg border-2 border-[#00fff7]"
                  >
                    <span className="flex items-center justify-center">
                      Continue to Exam Generation
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-150" />
                    </span>
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamTypeSelectionPage;