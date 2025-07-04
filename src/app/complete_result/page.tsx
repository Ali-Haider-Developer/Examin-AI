"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaRedo, FaArrowCircleRight } from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import Loader from '../components/2loder'; // Importing the Loader component
import { motion } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { API_BASE_URL } from '@/utils/apiConfig';
import THEME from "../components/Landing Page/theme";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import stampImg from "public/technavya_stamp.png";

ChartJS.register(ArcElement, Tooltip, Legend);

// Define types for the result data
interface OverallResult {
  result_id: string;
  exam_title: string;
  total_marks: number;
  obtained_marks: number;
  grade: string;
  percentage: number;
}

interface QuestionResult {
  question_id: string;
  statement: string;
  response: string | null;
  question_type: string;
  total_marks: number;
  obtained_marks: number;
  feedback: string;
}

interface StudentProgress {
  total_exams_taken: number;
  exams_passed: number;
  exams_failed: number;
  total_points: number;
  overall_percentage: number;
  overall_grade: string;
}

interface ResultData {
  overall_result: OverallResult;
  question_results: QuestionResult[];
  student_progress: StudentProgress;
}

export default function Result(): JSX.Element {
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);
  // Personal details state
  const [showDetailsForm, setShowDetailsForm] = useState(true);
  const [personalDetails, setPersonalDetails] = useState({
    name: typeof window !== 'undefined' ? localStorage.getItem('name') || '' : '',
    fatherName: typeof window !== 'undefined' ? localStorage.getItem('fatherName') || '' : '',
    age: typeof window !== 'undefined' ? localStorage.getItem('age') || '' : '',
    className: typeof window !== 'undefined' ? localStorage.getItem('className') || '' : '',
    email: typeof window !== 'undefined' ? localStorage.getItem('email') || '' : '',
    number: typeof window !== 'undefined' ? localStorage.getItem('number') || '' : '',
  });

  // Move handleRetry here so it's accessible in render
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setRetryCount((c) => c + 1);
  };

  useEffect(() => {
    const fetchAndCompleteExam = async (): Promise<void> => {
      const examId = localStorage.getItem("exam-id");
      const attemptId = localStorage.getItem("attemptID");
      const accessToken = localStorage.getItem("access_token");

      if (!examId || !attemptId || !accessToken) {
        setError("Missing required data (exam ID, attempt ID, or access token). Please try again or retake the exam.");
        setLoading(false);
        return;
      }

      try {
        // Step 1: Complete the Exam Attempt
        const completeResponse = await fetch(
          `${API_BASE_URL}/exams/complete_exam_attempt/${examId}/${attemptId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!completeResponse.ok) {
          const completeError = await completeResponse.json();
          setError(`Failed to complete the exam: ${completeError.message}`);
          setLoading(false);
          return;
        }

        // Step 2: Fetch the Exam Result
        const resultResponse = await fetch(
          `${API_BASE_URL}/results/generate_and_update_result/${attemptId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!resultResponse.ok) {
          const resultError = await resultResponse.json();
          setError(`Failed to fetch result: ${resultError.message}`);
          setLoading(false);
          return;
        }

        const resultData: ResultData = await resultResponse.json();
        // Robust check for missing/incomplete result
        if (!resultData || !resultData.overall_result || !resultData.question_results || !Array.isArray(resultData.question_results) || resultData.question_results.length === 0) {
          setError("Result data is incomplete or not available yet. Please retry or contact support if this persists.");
          setResult(null);
          setLoading(false);
          return;
        }
        setResult(resultData);
        localStorage.setItem("result", JSON.stringify(resultData));
        setLoading(false);
      } catch (error: unknown) {
        console.error("Error during exam completion or result fetching:", error);
        setError("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    };
    fetchAndCompleteExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount]);

  const retakeExam = (): void => {
    localStorage.removeItem("exam-id");
    localStorage.removeItem("attemptID");
    router.push("/ExamGenration"); // Redirect to the exam generation page for a new attempt
  };

  // Personal details form submit handler
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('name', personalDetails.name);
      localStorage.setItem('fatherName', personalDetails.fatherName);
      localStorage.setItem('age', personalDetails.age);
      localStorage.setItem('className', personalDetails.className);
      localStorage.setItem('email', personalDetails.email);
      localStorage.setItem('number', personalDetails.number);
    }
    setShowDetailsForm(false);
  };
  // Skip handler
  const handleSkip = () => {
    setShowDetailsForm(false);
  };

  // Show personal details form before result
  if (showDetailsForm) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
        <form onSubmit={handleDetailsSubmit} className="bg-[#1a0066]/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center border-2 border-[#00fff7] max-w-md w-full flex flex-col gap-5">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-transparent bg-clip-text mb-6">Enter Your Details</h1>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Name"
              className="px-4 py-3 rounded-lg border-2 border-[#00fff7] bg-[#050014]/80 text-[#e0e0ff] focus:outline-none focus:ring-2 focus:ring-[#ff00ea] placeholder-[#00fff7] font-semibold shadow-inner"
              value={personalDetails.name}
              onChange={e => setPersonalDetails({ ...personalDetails, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Father Name"
              className="px-4 py-3 rounded-lg border-2 border-[#00fff7] bg-[#050014]/80 text-[#e0e0ff] focus:outline-none focus:ring-2 focus:ring-[#ff00ea] placeholder-[#00fff7] font-semibold shadow-inner"
              value={personalDetails.fatherName}
              onChange={e => setPersonalDetails({ ...personalDetails, fatherName: e.target.value })}
            />
            <input
              type="number"
              placeholder="Age"
              className="px-4 py-3 rounded-lg border-2 border-[#00fff7] bg-[#050014]/80 text-[#e0e0ff] focus:outline-none focus:ring-2 focus:ring-[#ff00ea] placeholder-[#00fff7] font-semibold shadow-inner"
              value={personalDetails.age}
              onChange={e => setPersonalDetails({ ...personalDetails, age: e.target.value })}
            />
            <input
              type="text"
              placeholder="Class"
              className="px-4 py-3 rounded-lg border-2 border-[#00fff7] bg-[#050014]/80 text-[#e0e0ff] focus:outline-none focus:ring-2 focus:ring-[#ff00ea] placeholder-[#00fff7] font-semibold shadow-inner"
              value={personalDetails.className}
              onChange={e => setPersonalDetails({ ...personalDetails, className: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-3 rounded-lg border-2 border-[#00fff7] bg-[#050014]/80 text-[#e0e0ff] focus:outline-none focus:ring-2 focus:ring-[#ff00ea] placeholder-[#00fff7] font-semibold shadow-inner"
              value={personalDetails.email}
              onChange={e => setPersonalDetails({ ...personalDetails, email: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Number"
              className="px-4 py-3 rounded-lg border-2 border-[#00fff7] bg-[#050014]/80 text-[#e0e0ff] focus:outline-none focus:ring-2 focus:ring-[#ff00ea] placeholder-[#00fff7] font-semibold shadow-inner"
              value={personalDetails.number}
              onChange={e => setPersonalDetails({ ...personalDetails, number: e.target.value })}
            />
          </div>
          <div className="flex gap-4 mt-6 justify-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black font-bold px-8 py-3 rounded-lg border-2 border-[#00fff7] hover:scale-105 transition-all shadow-lg"
            >
              Save & Continue
            </button>
            <button
              type="button"
              className="bg-gradient-to-r from-[#ff00ea] to-[#00fff7] text-black font-bold px-8 py-3 rounded-lg border-2 border-[#00fff7] hover:scale-105 transition-all shadow-lg"
              onClick={handleSkip}
            >
              Skip
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-[#00fff7] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#00fff7] font-medium">Loading your result...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
        <div className="bg-[#1a0066]/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center border-2 border-[#ff00ea] max-w-md w-full">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff00ea] to-[#00fff7] text-transparent bg-clip-text mb-4">Error</h1>
          <p className="text-[#e0e0ff] mb-4">{error}</p>
          <div className="flex flex-col gap-3 mt-4">
            <button
              className="bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black font-bold px-6 py-2 rounded-lg border-2 border-[#00fff7] hover:scale-105 transition-all"
              onClick={handleRetry}
            >
              Retry
            </button>
          <button
              className="bg-gradient-to-r from-[#ff00ea] to-[#00fff7] text-black font-bold px-6 py-2 rounded-lg border-2 border-[#00fff7] hover:scale-105 transition-all"
            onClick={() => router.push("/DashBoard")}
          >
            Go to Dashboard
          </button>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
        <div className="bg-[#1a0066]/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center border-2 border-[#00fff7] max-w-md w-full">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff00ea] to-[#00fff7] text-transparent bg-clip-text mb-4">No result data found</h1>
          <p className="text-[#e0e0ff] mb-4">Please try again.</p>
          <button
            className="bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black font-bold px-6 py-2 rounded-lg border-2 border-[#00fff7] hover:scale-105 transition-all"
            onClick={handleRetry}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { overall_result, question_results } = result;

  // Pie chart data
  const pieData = {
    labels: ["Correct Answers", "Incorrect Answers"],
    datasets: [
      {
        data: [
          overall_result.obtained_marks,
          overall_result.total_marks - overall_result.obtained_marks,
        ],
        backgroundColor: ["#38A169", "#D4E157"],
        hoverBackgroundColor: ["#2F855A", "#9E9E9E"],
      },
    ],
  };

  // Replace userEmail with personalDetails.email, and add name/phone where needed
  const userName = personalDetails.name || (typeof window !== 'undefined' ? localStorage.getItem('name') : '');
  const userFatherName = personalDetails.fatherName || (typeof window !== 'undefined' ? localStorage.getItem('fatherName') : '');
  const userAge = personalDetails.age || (typeof window !== 'undefined' ? localStorage.getItem('age') : '');
  const userClass = personalDetails.className || (typeof window !== 'undefined' ? localStorage.getItem('className') : '');
  const userEmail = personalDetails.email || (typeof window !== 'undefined' ? localStorage.getItem('email') : '');
  const userNumber = personalDetails.number || (typeof window !== 'undefined' ? localStorage.getItem('number') : '');

  const downloadResultCard = () => {
    if (!result) return;
    const { overall_result } = result;
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    // Neon/AI style colors
    const neonBlue = "#00fff7";
    const neonPink = "#ff00ea";
    const darkBg = "#1a0066";
    const white = "#e0e0ff";
    let y = 40;
    // Header
    doc.setFillColor(darkBg);
    doc.rect(0, 0, 595, 180, "F");
    doc.setFontSize(28);
    doc.setTextColor(neonBlue);
    doc.text("Technavya AI Result Card", 40, y);
    y += 30;
    doc.setFontSize(16);
    doc.setTextColor(white);
    doc.text("Personal Details", 40, y);
    y += 24;
    doc.setFontSize(13);
    doc.setTextColor(neonPink);
    doc.text(`Name: `, 40, y);
    doc.setTextColor(white);
    doc.text(userName || "-", 120, y);
    y += 20;
    doc.setTextColor(neonPink);
    doc.text(`Father Name: `, 40, y);
    doc.setTextColor(white);
    doc.text(userFatherName || "-", 120, y);
    y += 20;
    doc.setTextColor(neonPink);
    doc.text(`Age: `, 40, y);
    doc.setTextColor(white);
    doc.text(userAge || "-", 120, y);
    y += 20;
    doc.setTextColor(neonPink);
    doc.text(`Class: `, 40, y);
    doc.setTextColor(white);
    doc.text(userClass || "-", 120, y);
    y += 20;
    doc.setTextColor(neonPink);
    doc.text(`Email: `, 40, y);
    doc.setTextColor(white);
    doc.text(userEmail || "-", 120, y);
    y += 20;
    doc.setTextColor(neonPink);
    doc.text(`Number: `, 40, y);
    doc.setTextColor(white);
    doc.text(userNumber || "-", 120, y);
    y += 30;
    // Section divider
    doc.setDrawColor(neonBlue);
    doc.setLineWidth(2);
    doc.line(40, y, 555, y);
    y += 20;
    // Exam Result Summary
    doc.setFontSize(16);
    doc.setTextColor(neonBlue);
    doc.text("Exam Result Summary", 40, y);
    y += 24;
    autoTable(doc, {
      startY: y,
      theme: 'grid',
      styles: {
        fillColor: darkBg,
        textColor: white,
        fontStyle: 'bold',
        fontSize: 14,
        halign: 'left',
        cellPadding: 8,
        lineColor: neonBlue,
        lineWidth: 1.2,
      },
      head: [["Field", "Value"]],
      body: [
        ["Result ID", overall_result.result_id],
        ["Total Marks", overall_result.total_marks],
        ["Obtained Marks", overall_result.obtained_marks],
        ["Percentage", `${overall_result.percentage}%`],
        ["Grade", overall_result.grade],
      ],
      headStyles: {
        fillColor: neonBlue,
        textColor: darkBg,
        fontSize: 15,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fillColor: darkBg,
        textColor: white,
        fontSize: 14,
      },
      alternateRowStyles: {
        fillColor: "#050014",
      },
      tableLineColor: neonBlue,
      tableLineWidth: 1.2,
    });
    // Stamp at the bottom
    const img = new window.Image();
    img.src = "/technavya_stamp.png";
    img.onload = function() {
      doc.addImage(img, "PNG", 180, 670, 200, 200, undefined, 'FAST');
      doc.setFontSize(14);
      doc.setTextColor(neonBlue);
      doc.text("Authorized Result Stamp", 200, 870);
      doc.save("Result_Card_TechnavyaAI.pdf");
    };
    img.onerror = function() {
      doc.setFontSize(32);
      doc.setTextColor(neonPink);
      doc.text("Technavya AI", 180, 750, { angle: -10 });
      doc.setFontSize(14);
      doc.setTextColor(neonBlue);
      doc.text("Authorized Result Stamp", 200, 770);
      doc.save("Result_Card_TechnavyaAI.pdf");
    };
  };

  return (
    <>
      <Head>
        <title>Exam Result | ExaminieAI</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
        <motion.div
          className="bg-[#1a0066]/80 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden w-full max-w-4xl border-4 border-[#00fff7] relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Glowing border effect */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#00fff7]/60 via-[#ff00ea]/60 to-[#00fff7]/60 blur-2xl opacity-60 z-0" />

          {/* Download PDF Button */}
          <div className="flex justify-end p-4 z-10 relative">
            <button
              onClick={downloadResultCard}
              className="bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black font-bold px-6 py-2 rounded-lg border-2 border-[#00fff7] shadow-lg hover:scale-105 transition-all"
            >
              Download Result Card (PDF)
            </button>
                </div>

          {/* User Details Card */}
          <div className="flex flex-col md:flex-row items-center gap-8 px-8 pt-2 pb-2 z-10 relative">
            <div className="flex-1 bg-[#050014]/80 rounded-2xl border-2 border-[#ff00ea] p-6 shadow-lg flex flex-col gap-2">
              <span className="text-[#00fff7] font-bold text-lg mb-2 flex items-center gap-2"><svg width='20' height='20' fill='none'><circle cx='10' cy='10' r='9' stroke='#00fff7' strokeWidth='2'/></svg>Personal Details</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <div><span className="text-[#ff00ea] font-semibold">Name:</span> <span className="text-[#e0e0ff]">{userName || '-'}</span></div>
                <div><span className="text-[#ff00ea] font-semibold">Father Name:</span> <span className="text-[#e0e0ff]">{userFatherName || '-'}</span></div>
                <div><span className="text-[#ff00ea] font-semibold">Age:</span> <span className="text-[#e0e0ff]">{userAge || '-'}</span></div>
                <div><span className="text-[#ff00ea] font-semibold">Class:</span> <span className="text-[#e0e0ff]">{userClass || '-'}</span></div>
                <div><span className="text-[#ff00ea] font-semibold">Email:</span> <span className="text-[#e0e0ff]">{userEmail || '-'}</span></div>
                <div><span className="text-[#ff00ea] font-semibold">Number:</span> <span className="text-[#e0e0ff]">{userNumber || '-'}</span></div>
              </div>
            </div>
          </div>

          {/* Header with neon gradient background */}
          <div className="p-8 text-center relative overflow-hidden z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00fff7]/60 to-[#ff00ea]/60 border-4 border-[#00fff7] flex items-center justify-center shadow-2xl animate-pulse">
                <FaCheckCircle className="text-[#00fff7] text-4xl drop-shadow-lg" />
              </div>
            </div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-transparent bg-clip-text mb-2 drop-shadow-lg">Your Exam Results</h1>
            <p className="text-[#e0e0ff] text-xl font-semibold drop-shadow">{overall_result.exam_title}</p>
          </div>

          {/* Score Summary */}
          <div className="p-8 z-10 relative">
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-10">
              {/* Pie Chart */}
              <motion.div
                className="w-60 h-60 bg-[#050014]/80 rounded-full flex items-center justify-center border-4 border-[#00fff7] shadow-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Pie
                  data={{
                    ...pieData,
                    datasets: [{
                      ...pieData.datasets[0],
                      backgroundColor: ["#00fff7", "#ff00ea"],
                      hoverBackgroundColor: ["#00fff7", "#ff00ea"],
                      borderWidth: 0
                    }]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                          color: '#e0e0ff',
                          font: {
                            size: 14
                          }
                        }
                      }
                    }
                  }}
                />
              </motion.div>

              {/* Score Cards */}
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  className="bg-[#050014]/80 rounded-xl p-6 text-center border-2 border-[#00fff7] shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <p className="text-xs text-[#7f00ff] mb-1">Total Marks</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-transparent bg-clip-text">{overall_result.total_marks}</p>
                </motion.div>

                <motion.div
                  className="bg-[#050014]/80 rounded-xl p-6 text-center border-2 border-[#00fff7] shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <p className="text-xs text-[#7f00ff] mb-1">Obtained Marks</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-transparent bg-clip-text">{overall_result.obtained_marks}</p>
                </motion.div>

                <motion.div
                  className="bg-[#050014]/80 rounded-xl p-6 text-center border-2 border-[#00fff7] shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <p className="text-xs text-[#7f00ff] mb-1">Percentage</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-transparent bg-clip-text">{overall_result.percentage}%</p>
                </motion.div>

                <motion.div
                  className="bg-[#050014]/80 rounded-xl p-6 text-center border-2 border-[#00fff7] shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <p className="text-xs text-[#7f00ff] mb-1">Grade</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-transparent bg-clip-text">{overall_result.grade}</p>
                </motion.div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#00fff7]/30"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#1a0066]/80 px-6 py-1 text-lg text-[#00fff7] font-bold border-2 border-[#00fff7] rounded-full shadow">Detailed Feedback</span>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="space-y-8 mb-8">
              {question_results.map((question, index) => (
                <motion.div
                  key={question.question_id}
                  className="bg-gradient-to-br from-[#1a0066]/90 to-[#050014]/90 rounded-2xl p-8 border-2 border-[#1a0066] hover:shadow-2xl transition-shadow duration-300 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
                >
                  <div className="flex items-start gap-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00fff7] to-[#ff00ea] flex items-center justify-center flex-shrink-0 mt-1 border-2 border-[#1a0066] shadow-lg">
                      <span className="text-black font-bold text-lg">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#e0e0ff] mb-3 text-lg">
                        {question.statement}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-[#1a0066]/60 p-4 rounded-lg border-2 border-[#00fff7] shadow-inner">
                          <p className="text-xs text-[#7f00ff] mb-1">Your Answer</p>
                          <p className="font-bold text-[#e0e0ff]">{question.response || "Unattempted"}</p>
                        </div>

                        <div className="bg-[#1a0066]/60 p-4 rounded-lg border-2 border-[#00fff7] shadow-inner">
                          <p className="text-xs text-[#7f00ff] mb-1">Marks</p>
                          <p className="font-bold text-[#e0e0ff]">
                            <span className={question.obtained_marks === question.total_marks ? "text-[#00fff7]" : "text-[#ff00ea]"}>
                              {question.obtained_marks}
                            </span>
                            /{question.total_marks}
                          </p>
                        </div>
                      </div>

                      <div className="bg-[#1a0066]/60 p-4 rounded-lg border-l-4 border-[#00fff7] shadow-inner">
                        <p className="text-xs text-[#00fff7] mb-1 font-bold">Feedback</p>
                        <p className="text-[#e0e0ff]">{question.feedback}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-[#ff00ea] to-[#00fff7] text-black font-bold rounded-xl border-2 border-[#00fff7] hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg text-lg"
                onClick={retakeExam}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FaRedo className="text-[#00fff7] text-2xl" />
                <span>Retake Exam</span>
              </motion.button>
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black font-bold rounded-xl border-2 border-[#00fff7] hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg text-lg"
                onClick={() => router.push("/DashBoard")}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FaArrowCircleRight className="text-[#ff00ea] text-2xl" />
                <span>Back to Dashboard</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
