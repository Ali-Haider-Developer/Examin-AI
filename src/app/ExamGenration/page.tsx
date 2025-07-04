"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/SiderBar/page";
import Loader from "../components/lodder";
import { API_BASE_URL } from '@/utils/apiConfig';
import {
  FaCheckCircle, FaTimesCircle, FaArrowLeft, FaRocket,
  FaClipboardList, FaHourglassHalf, FaTrophy, FaChartBar,
  FaLightbulb, FaGraduationCap, FaSpinner
} from 'react-icons/fa';
import THEME from "../components/Landing Page/theme";
import LandingBackground from "../components/Landing Page/LandingBackground";
import Image from "next/image";

const ExamGenerationAndConfirmationPage = () => {
  const [loading, setLoading] = useState(false);
  const [examParams, setExamParams] = useState<any>(null);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get exam parameters from localStorage
    const params = localStorage.getItem('examParameters');
    if (params) {
      setExamParams(JSON.parse(params));
    }
  }, []);

  const handleGenerateExam = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const selectedContentIds = JSON.parse(localStorage.getItem('selected_content_ids') || '[]');
      const examType = localStorage.getItem('selectedExamType'); // Retrieve exam type

      if (!token || !examParams || !selectedContentIds.length || !examType) {
        throw new Error('Missing authentication token, exam parameters, content IDs, or exam type');
      }

      const requestBody = {
        selected_content_ids: selectedContentIds,
        title: "Generated Exam",
        questions_type: examParams.examType,
        difficulty: examParams.difficulty,
        num_questions: examParams.numberOfQuestions,
        marks_per_question: examParams.marksPerQuestion,
        time_limit: examParams.isTimed ? examParams.duration : 0,
        language: examParams.language || "en",
      };

      console.log('Request Body:', requestBody);

      const response = await fetch(
        `${API_BASE_URL}/exams/create_exam/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to generate exam');
      }

      const data = await response.json();
      console.log('Exam generated successfully:', data);

      localStorage.setItem('exam-id', data.id);

      setMessage({ text: 'Exam generated successfully!', type: 'success' });

      // Dynamic redirect based on exam type
      setTimeout(() => {
        const redirectUrl = `/exam/${examType.toLowerCase()}`; // Construct dynamic URL
        router.push(redirectUrl);
      }, 2000);
    } catch (error: unknown) {
      console.error('Error generating exam:', error);
      setMessage({
        text: (error as Error).message || 'Failed to generate exam. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };


  const handleCancel = () => {
    setMessage(null);
  };

  if (!examParams) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ml-[240px]`}>
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-8 overflow-hidden" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
          <LandingBackground />
          {loading && <Loader />}

          {/* Top Bar with Branding */}
          <div className="w-full flex items-center justify-between mb-10 z-10">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Technavya AI Logo" width={40} height={40} style={{ filter: 'drop-shadow(0 0 8px #00fff7)' }} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff00ea] to-[#00fff7] bg-clip-text text-transparent">Exam Generation</h1>
            </div>
          </div>

          {/* Page Header */}
          <header className="relative z-10 text-center mb-10 w-full max-w-4xl">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-transparent bg-clip-text mb-4 leading-tight tracking-tight">
                Confirm Your Exam Setup
              </h1>
              <p className="text-[#e0e0ff] mt-4 text-lg max-w-2xl mx-auto">
                Review your settings and confirm to proceed. We'll generate your personalized exam based on these parameters.
              </p>
              <div className="w-full max-w-xl mx-auto mt-6 h-1 bg-gradient-to-r from-[#00fff7] via-[#7f00ff] to-[#ff00ea] rounded-full"></div>
            </div>
          </header>

          {/* Message Display */}
          {message && (
            <div className={`w-full max-w-3xl mb-6 p-4 rounded-xl shadow-xl z-10 ${
              message.type === 'success'
                ? 'bg-[#00fff7]/10 border-l-4 border-[#00fff7] text-[#00fff7]'
                : 'bg-[#ff00ea]/10 border-l-4 border-[#ff00ea] text-[#ff00ea]'
            }`}>
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <FaCheckCircle className="w-5 h-5 mr-3 text-[#00fff7]" />
                ) : (
                  <FaTimesCircle className="w-5 h-5 mr-3 text-[#ff00ea]" />
                )}
                <p className="font-medium">{message.text}</p>
              </div>
            </div>
          )}

          {/* Exam Summary Box */}
          <div className="w-full max-w-3xl bg-[#1a0066]/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border-2 border-[#00fff7] z-10" style={{ boxShadow: `0 0 32px ${THEME.accent1}` }}>
            <div className="flex items-center mb-6 pb-4 border-b border-[#00fff7]/30">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00fff7] to-[#ff00ea] flex items-center justify-center mr-4 shadow-lg">
                <FaClipboardList className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#00fff7]">
                  Review Your Exam Settings
                </h2>
                <p className="text-[#e0e0ff] text-sm">
                  Make sure everything is correct before proceeding
                </p>
              </div>
            </div>

            {/* Exam Settings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#050014]/80 p-4 rounded-xl border-2 border-[#1a0066]">
                <div className="flex items-center mb-3">
                  <FaGraduationCap className="text-[#00fff7] mr-2" />
                  <h3 className="font-medium text-[#e0e0ff]">Exam Type</h3>
                </div>
                <p className="text-lg font-semibold text-[#e0e0ff] ml-6">{examParams.examType}</p>
              </div>
              <div className="bg-[#050014]/80 p-4 rounded-xl border-2 border-[#1a0066]">
                <div className="flex items-center mb-3">
                  <FaClipboardList className="text-[#00fff7] mr-2" />
                  <h3 className="font-medium text-[#e0e0ff]">Number of Questions</h3>
                </div>
                <p className="text-lg font-semibold text-[#e0e0ff] ml-6">{examParams.numberOfQuestions}</p>
              </div>
              <div className="bg-[#050014]/80 p-4 rounded-xl border-2 border-[#1a0066]">
                <div className="flex items-center mb-3">
                  <FaChartBar className="text-[#00fff7] mr-2" />
                  <h3 className="font-medium text-[#e0e0ff]">Difficulty</h3>
                </div>
                <p className="text-lg font-semibold text-[#e0e0ff] ml-6">{examParams.difficulty}</p>
              </div>
              <div className="bg-[#050014]/80 p-4 rounded-xl border-2 border-[#1a0066]">
                <div className="flex items-center mb-3">
                  <FaHourglassHalf className="text-[#00fff7] mr-2" />
                  <h3 className="font-medium text-[#e0e0ff]">Time Limit</h3>
                </div>
                <p className="text-lg font-semibold text-[#e0e0ff] ml-6">
                  {examParams.isTimed ? `${examParams.duration} minutes` : 'No time limit'}
                </p>
              </div>
              <div className="bg-[#050014]/80 p-4 rounded-xl border-2 border-[#1a0066]">
                <div className="flex items-center mb-3">
                  <FaTrophy className="text-[#00fff7] mr-2" />
                  <h3 className="font-medium text-[#e0e0ff]">Marks per Question</h3>
                </div>
                <p className="text-lg font-semibold text-[#e0e0ff] ml-6">{examParams.marksPerQuestion}</p>
              </div>
              <div className="bg-[#050014]/80 p-4 rounded-xl border-2 border-[#1a0066]">
                <div className="flex items-center mb-3">
                  <FaTrophy className="text-[#00fff7] mr-2" />
                  <h3 className="font-medium text-[#e0e0ff]">Total Marks</h3>
                </div>
                <p className="text-lg font-semibold text-[#e0e0ff] ml-6">{examParams.totalMarks}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-6 mt-8">
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-[#1a0066]/60 border-2 border-[#ff00ea] text-[#ff00ea] font-medium rounded-xl hover:bg-[#ff00ea]/10 hover:text-[#ff00ea] transition-all flex items-center space-x-2 backdrop-blur-md"
              >
                <FaTimesCircle className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleGenerateExam}
                className={`px-8 py-3 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black font-bold rounded-xl transition-all duration-300 flex items-center space-x-2 border-2 border-[#00fff7] shadow-lg hover:scale-105 hover:shadow-2xl ${
                  loading ? 'opacity-75 cursor-wait' : ''
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FaRocket className="w-4 h-4" />
                    <span>Generate Exam</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Helpful Tips */}
          <div className="w-full max-w-3xl mt-8 bg-[#1a0066]/70 backdrop-blur-lg p-6 rounded-xl border-2 border-[#00fff7] z-10" style={{ boxShadow: `0 0 16px ${THEME.accent2}` }}>
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00fff7] to-[#ff00ea] flex items-center justify-center mr-4 mt-1 shadow-lg">
                <FaLightbulb className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="font-medium text-[#00fff7] mb-2">Helpful Tips</h3>
                <ul className="text-[#e0e0ff] text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="inline-block w-4 h-4 bg-[#7f00ff] rounded-full mr-2 mt-1"></span>
                    <span>The exam will be generated based on the content you've uploaded.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-4 h-4 bg-[#7f00ff] rounded-full mr-2 mt-1"></span>
                    <span>You can retake the exam multiple times with different questions.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-4 h-4 bg-[#7f00ff] rounded-full mr-2 mt-1"></span>
                    <span>Your results will be saved for future reference.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamGenerationAndConfirmationPage;
