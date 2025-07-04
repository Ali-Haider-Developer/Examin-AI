"use client"
import { API_BASE_URL } from '@/utils/apiConfig';
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import THEME from "../../components/Landing Page/theme";

interface ExamDetails {
  id: string;
  title: string;
  questions_type: string;
  difficulty: string;
  num_questions: number;
  marks_per_question: number;
  total_marks: number;
  time_limit: number; // Time in minutes
  questions: Question[];
}

interface Question {
  id: string;
  statement: string;
  question_data: {
    option1: string;
    option2: string;
    option3: string;
    option4: string;
  };
}

interface Answer {
  question_id: string;
  response: string;
}

const AttemptExamPage = () => {
  const [examDetails, setExamDetails] = useState<ExamDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [attemptStarted, setAttemptStarted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0); // Timer in seconds
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [untimedExam, setUntimedExam] = useState<boolean>(false); // NEW

  const fetchExamDetails = async () => {
    const examId = localStorage.getItem("exam-id");
    const accessToken = localStorage.getItem("access_token");

    if (!examId || !accessToken) {
      setError("Missing exam ID or access token.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/exams/get_full_exam/${examId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        setError(`Failed to fetch exam details: ${errorResponse.message}`);
        return;
      }

      const data = await response.json();
      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        setError("This exam has no questions. Please contact your instructor or try again later.");
        setExamDetails(null);
        setLoading(false);
        return;
      }
      setExamDetails(data);

      // Initialize answers array
      const initialAnswers = data.questions.map((q: Question) => ({
        question_id: q.id,
        response: "",
      }));
      setAnswers(initialAnswers);
    } catch (err) {
      setError("An error occurred while fetching exam details.");
    } finally {
      setLoading(false);
    }
  };

  const startExamAttempt = async () => {
    if (!examDetails || !examDetails.questions || examDetails.questions.length === 0) {
      setError("Cannot start exam: No questions available.");
      return;
    }
    const examId = localStorage.getItem("exam-id");
    const accessToken = localStorage.getItem("access_token");

    if (!examId || !accessToken) {
      setError("Missing exam ID or access token.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/exams/start_exam_attempt/${examId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        setError(`Failed to start the exam: ${responseData.message}`);
        return;
      }

      // Save attempt ID to local storage
      const attemptId = responseData.attempt?.id;
      if (attemptId) {
        localStorage.setItem("attemptID", attemptId);
      }

      setAttemptStarted(true);
      if (!examDetails.time_limit || examDetails.time_limit <= 0) {
        setUntimedExam(true);
        setTimeLeft(0);
      } else {
        setUntimedExam(false);
        setTimeLeft(examDetails.time_limit * 60);
      }
    } catch (err) {
      setError("An error occurred while starting the exam.");
    }
  };

  const handleOptionSelect = (questionId: string, selectedOption: string) => {
    console.log("Selected option for question", questionId, ":", selectedOption);
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.question_id === questionId
          ? { ...answer, response: selectedOption }
          : answer
      )
    );
  };

  const submitAllAnswers = async () => {
    if (isSubmitting) return; // Prevent multiple submissions

    const examId = localStorage.getItem("exam-id");
    const accessToken = localStorage.getItem("access_token");

    if (!examId || !accessToken) {
      setError("Missing exam ID or access token.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/exams/submit_all_answers/${examId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers }),
        }
      );

      const responseData = await response.json();
      console.log("Submit answers response:", responseData);

      if (!response.ok) {
        if (response.status === 409) {
          console.log("Exam already submitted");
          setError("You have already submitted this exam.");
        } else {
          setError(`Failed to submit answers: ${responseData.message}`);
        }
        return;
      }

      console.log("Exam submitted successfully");
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Error submitting answers:", err);
      setError("An error occurred while submitting answers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchExamDetails();
  }, []);

  useEffect(() => {
    if (untimedExam) return; // Don't run timer for untimed exams
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && attemptStarted) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && attemptStarted && !untimedExam) {
      submitAllAnswers();
    }
    return () => clearInterval(timer);
  }, [timeLeft, attemptStarted, untimedExam]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQuestion = examDetails?.questions && examDetails.questions[currentQuestionIndex];

  if (loading) {
    return <p>Loading exam details...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
        <div className="bg-[#1a0066]/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center border-2 border-[#00fff7] max-w-md w-full">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-[#00fff7] to-[#ff00ea] flex items-center justify-center shadow-lg mb-4">
            <svg className="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-transparent bg-clip-text mb-4">Exam Submitted Successfully!</h2>
          <p className="text-[#e0e0ff] mb-6">Thank you for completing the exam. Your responses have been recorded.</p>
          <button
            onClick={() => window.location.href = '/complete_result'}
            className="bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black font-bold px-8 py-3 rounded-xl border-2 border-[#00fff7] shadow-lg hover:scale-105 transition-all text-lg"
          >
            See Result
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
      {!attemptStarted ? (
        <div className="w-full max-w-xl bg-[#1a0066]/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border-2 border-[#00fff7]" style={{ boxShadow: `0 0 32px ${THEME.accent1}` }}>
          {/* Gradient Header */}
          <div className="p-8 text-center" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
            <h1 className="text-3xl font-extrabold mb-1 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-transparent bg-clip-text">Generated Exam</h1>
            <p className="text-[#e0e0ff] text-base font-medium">Review the exam details before starting</p>
        </div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8 pt-8">
            <div className="bg-[#050014]/80 rounded-xl p-4 flex flex-col items-center border-2 border-[#1a0066]">
              <span className="text-xs text-[#7f00ff] mb-1">Exam Type</span>
              <span className="font-bold text-lg text-[#e0e0ff]">{examDetails?.questions_type}</span>
              </div>
            <div className="bg-[#050014]/80 rounded-xl p-4 flex flex-col items-center border-2 border-[#1a0066]">
              <span className="text-xs text-[#7f00ff] mb-1">Total Marks</span>
              <span className="font-bold text-lg text-[#e0e0ff]">{examDetails?.total_marks}</span>
            </div>
            <div className="bg-[#050014]/80 rounded-xl p-4 flex flex-col items-center border-2 border-[#1a0066]">
              <span className="text-xs text-[#7f00ff] mb-1">Time Limit</span>
              <span className="font-bold text-lg text-[#e0e0ff]">{examDetails?.time_limit} minutes</span>
                </div>
              </div>
          {/* Info Box */}
          <div className="px-8 pt-8">
            <div className="bg-[#1a0066]/60 border-l-4 border-[#00fff7] rounded-xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-[#00fff7] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div>
                <p className="text-sm text-[#00fff7] font-semibold mb-1">Important Information</p>
                <p className="text-xs text-[#e0e0ff]">Once you start the exam, the timer will begin. Make sure you have enough time to complete the exam. You can navigate between questions using the previous and next buttons.</p>
              </div>
            </div>
          </div>
          {/* Start Button */}
          <div className="flex justify-center py-8">
            <button
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black font-bold rounded-lg shadow-lg hover:scale-105 transition-all text-lg border-2 border-[#00fff7]"
              onClick={startExamAttempt}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Start Exam
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          className="w-full max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
            {/* Exam Progress Header */}
            <div className="bg-white border-b border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                    <span className="font-bold text-emerald-600">{currentQuestionIndex + 1}</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-800">
                      Question {currentQuestionIndex + 1} of {examDetails?.num_questions}
                    </h2>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / (examDetails?.num_questions || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 px-4 py-2 rounded-full border border-red-100 flex items-center">
                  <svg className="w-4 h-4 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-red-600">
                    {formatTime(timeLeft)}
                  </p>
                </div>
              </div>
            </div>

            {/* Question Content */}
            <div className="p-6">
              <div className="bg-gray-50 p-5 rounded-xl mb-6 border border-gray-100">
                <p className="text-lg text-gray-800 font-medium">
                  {currentQuestion?.statement || "No question available."}
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {Object.entries(
                  currentQuestion.question_data || {}
                )
                  .filter(([key]) => key.startsWith("option"))
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 ${
                        answers[currentQuestionIndex]?.response === key
                          ? "bg-emerald-50 border-emerald-300 shadow-sm"
                          : "bg-white border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30"
                      }`}
                      onClick={() =>
                        handleOptionSelect(
                          currentQuestion.id,
                          key
                        )
                      }
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border flex-shrink-0 mr-3 flex items-center justify-center ${
                          answers[currentQuestionIndex]?.response === key
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-gray-300"
                        }`}>
                          {answers[currentQuestionIndex]?.response === key && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`${
                          answers[currentQuestionIndex]?.response === key
                            ? "text-emerald-800 font-medium"
                            : "text-gray-700"
                        }`}>{value}</span>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6 border-t border-gray-100 pt-6">
                <button
                  className={`px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl flex items-center space-x-2 transition-colors ${
                    currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={currentQuestionIndex === 0}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </button>

                {currentQuestionIndex === (examDetails?.num_questions || 1) - 1 ? (
                  <button
                    className={`px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl flex items-center space-x-2 transition-all ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'
                    }`}
                    onClick={submitAllAnswers}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Submit Exam</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl flex items-center space-x-2 hover:shadow-md transition-all"
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        Math.min(prev + 1, (examDetails?.num_questions || 1) - 1)
                      )
                    }
                  >
                    <span>Next</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Question Navigation */}
            <div className="bg-gray-50 p-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-3">Question Navigation</p>
              <div className="flex flex-wrap gap-2">
                {examDetails?.questions.map((_, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      currentQuestionIndex === index
                        ? 'bg-emerald-500 text-white'
                        : answers[index]?.response
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AttemptExamPage;
