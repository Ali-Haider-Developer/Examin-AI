"use client";

import React, { useEffect, useState } from "react";
// import { Controlled as CodeMirror } from "@uiw/react-codemirror";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import Controlled from "@uiw/react-codemirror";
import { API_BASE_URL } from '@/utils/apiConfig';
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
  questions: ShortQuestion[];
}

interface ShortQuestion {
  id: string;
  statement: string;
}

interface Answer {
  question_id: string;
  response: string;
}

const ShortQuestionsPage = () => {
  const [examDetails, setExamDetails] = useState<ExamDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [attemptStarted, setAttemptStarted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0); // Timer in seconds
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [untimedExam, setUntimedExam] = useState<boolean>(false);

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
      setExamDetails(data);

      // Initialize answers array
      const initialAnswers = data.questions.map((q: ShortQuestion) => ({
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
      const attemptId = responseData.attempt?.id;
      if (attemptId) {
        localStorage.setItem("attemptID", attemptId);
      }
      setAttemptStarted(true);
      if (!examDetails?.time_limit || examDetails.time_limit <= 0) {
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

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.question_id === questionId
          ? { ...answer, response: value }
          : answer
      )
    );
  };

  const submitAllAnswers = async () => {
    if (isSubmitting) return;

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

      if (!response.ok) {
        let errorMsg = 'Failed to submit answers.';
        try {
          if (response.headers.get('content-type')?.includes('application/json')) {
        const responseData = await response.json();
            errorMsg = responseData.message || responseData.detail || errorMsg;
          } else {
            errorMsg = await response.text() || errorMsg;
          }
        } catch (e) {
          // ignore
        }
        setError(errorMsg);
        return;
      }

      setSubmitSuccess(true);
    } catch (err) {
      setError("An error occurred while submitting answers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchExamDetails();
  }, []);

  useEffect(() => {
    if (untimedExam) return;
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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-[#00fff7] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#00fff7] font-medium">Loading exam details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
        <div className="bg-[#1a0066]/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center border-2 border-[#00fff7] max-w-md w-full">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-transparent bg-clip-text mb-4">Exam Submitted Successfully!</h2>
          <button
            onClick={() => (window.location.href = "/complete_result")}
            className="bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black font-bold px-6 py-2 rounded-lg border-2 border-[#00fff7] hover:scale-105 transition-all"
          >
            Go to result
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
      {!attemptStarted ? (
        <div className="w-full max-w-xl bg-[#1a0066]/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border-2 border-[#00fff7] text-center">
          <div className="p-8" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
            <h1 className="text-3xl font-extrabold mb-1 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-transparent bg-clip-text">{examDetails?.title || 'Generated Exam'}</h1>
            <p className="text-[#e0e0ff] text-base font-medium">Review the exam details before starting</p>
          </div>
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
          <div className="px-8 pt-8">
            <div className="bg-[#1a0066]/60 border-l-4 border-[#00fff7] rounded-xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-[#00fff7] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <p className="text-sm text-[#00fff7] font-semibold mb-1">Important Information</p>
                <p className="text-xs text-[#e0e0ff]">This exam requires coding answers. Use the code editor to write your solution. You can navigate between questions using the previous and next buttons.</p>
              </div>
            </div>
          </div>
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
        <div className="w-full max-w-3xl bg-[#1a0066]/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border-2 border-[#00fff7]">
          <div className="border-b-2 border-[#00fff7]/30 p-6">
          <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00fff7] to-[#ff00ea] flex items-center justify-center mr-3">
                  <span className="font-bold text-black">{currentQuestionIndex + 1}</span>
                </div>
                <div>
                  <h2 className="font-bold text-[#e0e0ff]">
              Question {currentQuestionIndex + 1} of {examDetails?.num_questions}
            </h2>
                  <div className="w-full bg-[#050014] rounded-full h-1.5 mt-1">
                    <div
                      className="bg-gradient-to-r from-[#00fff7] to-[#ff00ea] h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / (examDetails?.num_questions || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              {!untimedExam && (
                <div className="bg-[#ff00ea]/10 px-4 py-2 rounded-full border border-[#ff00ea] flex items-center">
                  <svg className="w-4 h-4 text-[#ff00ea] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-[#ff00ea]">
                    {formatTime(timeLeft)}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="p-6">
            <div className="bg-[#050014]/80 p-5 rounded-xl mb-6 border-2 border-[#1a0066]">
              <p className="text-lg text-[#e0e0ff] font-medium">{currentQuestion?.statement}</p>
            </div>
          <CodeMirror
            value={answers[currentQuestionIndex]?.response || ""}
            height="200px"
              extensions={[javascript(), python()]}
            onChange={(value) =>
              handleInputChange(
                  currentQuestion?.id || "",
                value
              )
            }
              className="mt-4 border-2 border-[#00fff7] rounded-xl bg-[#1a0066] text-[#e0e0ff]"
            />
            <div className="flex justify-between mt-6 border-t border-[#00fff7]/30 pt-6">
              <button
                className={`px-5 py-2.5 bg-[#1a0066]/60 border-2 border-[#ff00ea] text-[#ff00ea] rounded-xl flex items-center space-x-2 transition-colors ${
                  currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#ff00ea]/10'
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
                  className={`px-5 py-2.5 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black rounded-xl flex items-center space-x-2 border-2 border-[#00fff7] shadow-lg hover:scale-105 transition-all ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  onClick={submitAllAnswers}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                  className="px-5 py-2.5 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black rounded-xl flex items-center space-x-2 border-2 border-[#00fff7] shadow-lg hover:scale-105 transition-all"
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
        </div>
      )}
    </div>
  );
};

export default ShortQuestionsPage;
