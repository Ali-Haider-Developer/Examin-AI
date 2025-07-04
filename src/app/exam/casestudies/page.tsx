"use client"
import { API_BASE_URL } from '@/utils/apiConfig';
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  case_study: string;
  question_data: {
    option1?: string;
    option2?: string;
    option3?: string;
    option4?: string;
  };
}

interface Answer {
  question_id: string;
  response: string;
}

const CaseStudiesExamPage = () => {
  const [examDetails, setExamDetails] = useState<ExamDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [attemptStarted, setAttemptStarted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0); // Timer in seconds
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

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
        console.log("Error fetching exam details:", errorResponse);
        setError(`Failed to fetch exam details: ${errorResponse.message}`);
        return;
      }

      const data = await response.json();
      console.log("Exam details response:", data);
      setExamDetails(data);

      // Initialize answers array
      const initialAnswers = data.questions.map((q: Question) => ({
        question_id: q.id,
        response: "",
      }));
      setAnswers(initialAnswers);
    } catch (err) {
      console.error("Error fetching exam details:", err);
      setError("An error occurred while fetching exam details.");
    } finally {
      setLoading(false);
    }
  };

  const startExamAttempt = async () => {
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
      console.log("Start exam attempt response:", responseData);

      if (!response.ok) {
        setError(`Failed to start the exam: ${responseData.message}`);
        return;
      }

      // Save attempt ID to local storage
      const attemptId = responseData.attempt?.id;
      if (attemptId) {
        localStorage.setItem("attemptID", attemptId);
        console.log("Attempt ID saved to local storage:", attemptId);
      } else {
        console.warn("Attempt ID is missing in the response.");
      }

      setAttemptStarted(true);
      setTimeLeft((examDetails?.time_limit || 0) * 60); // Convert minutes to seconds for timer
    } catch (err) {
      console.error("Error starting exam:", err);
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

  const handleTextResponse = (questionId: string, response: string) => {
    console.log("Text response for question", questionId, ":", response);
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.question_id === questionId
          ? { ...answer, response: response }
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
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && attemptStarted) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && attemptStarted) {
      console.log("Time is up - auto submitting exam");
      submitAllAnswers();
    }
    return () => clearInterval(timer);
  }, [timeLeft, attemptStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-emerald-700 font-medium">Loading exam details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 max-w-md">
          <div className="text-red-500 text-5xl mb-4 flex justify-center">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Error</h2>
          <p className="text-red-600 mb-6 text-center">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-2xl p-8 text-center border border-gray-100 max-w-md w-full"
        >
          <div className="text-emerald-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 text-transparent bg-clip-text mb-4">Exam Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">Thank you for completing the exam. Your responses have been recorded.</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/complete_result'}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            See Results
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 min-h-screen flex flex-col items-center justify-center p-6">
      {!attemptStarted ? (
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
            {/* Exam Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>

              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2 text-center">{examDetails?.title}</h1>
                <p className="text-white/80 text-center">Review the exam details before starting</p>
              </div>
            </div>

            {/* Exam Details */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Exam Type</p>
                  <p className="font-medium text-gray-800">{examDetails?.questions_type}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Total Marks</p>
                  <p className="font-medium text-gray-800">{examDetails?.total_marks}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Time Limit</p>
                  <p className="font-medium text-gray-800">{examDetails?.time_limit} minutes</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-400 mb-8">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-blue-800 font-medium mb-1">Important Information</p>
                    <p className="text-xs text-blue-700">
                      This exam contains case studies with related questions. Read each case study carefully before answering the questions.
                      You can navigate between questions using the previous and next buttons.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <motion.button
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  onClick={startExamAttempt}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Start Exam</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="w-full max-w-4xl"
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

            {/* Case Study Content */}
            <div className="p-6">
              {/* Case Study */}
              <div className="bg-blue-50 p-5 rounded-xl mb-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Case Study</h3>
                <div className="prose prose-sm max-w-none text-blue-900">
                  {examDetails?.questions[currentQuestionIndex]?.case_study ? (
                    <div dangerouslySetInnerHTML={{ __html: examDetails?.questions[currentQuestionIndex]?.case_study }} />
                  ) : (
                    <p>No case study provided for this question.</p>
                  )}
                </div>
              </div>

              {/* Question */}
              <div className="bg-gray-50 p-5 rounded-xl mb-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Question</h3>
                <p className="text-gray-800">{examDetails?.questions[currentQuestionIndex]?.statement}</p>
              </div>

              {/* Answer Section - Could be multiple choice or text input */}
              <div className="mb-8">
                {examDetails?.questions[currentQuestionIndex]?.question_data &&
                Object.keys(examDetails?.questions[currentQuestionIndex]?.question_data).length > 0 ? (
                  // Multiple choice options
                  <div className="space-y-3">
                    {Object.entries(
                      examDetails?.questions[currentQuestionIndex]?.question_data || {}
                    )
                      .filter(([key]) => key.startsWith("option") && key !== "undefined")
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
                              examDetails?.questions[currentQuestionIndex]?.id || "",
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
                ) : (
                  // Text input for open-ended questions
                  <div>
                    <textarea
                      value={answers[currentQuestionIndex]?.response || ""}
                      onChange={(e) =>
                        handleTextResponse(
                          examDetails?.questions[currentQuestionIndex]?.id || "",
                          e.target.value
                        )
                      }
                      className="w-full h-48 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
                      placeholder="Type your answer here..."
                    />
                  </div>
                )}
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

export default CaseStudiesExamPage;
