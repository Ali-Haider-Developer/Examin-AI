"use client";

import React, { useEffect, useState } from "react";
import THEME from "../components/Landing Page/theme";
import { FaFileAlt, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaSearch } from "react-icons/fa";
import { API_BASE_URL } from "@/utils/apiConfig";

const statusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "text-green-400";
    case "In Progress":
      return "text-yellow-400";
    case "Failed":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
};

const HistoryPage = () => {
  const [examHistory, setExamHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  const handleViewDetails = (exam: any) => {
    // Store the attempt ID and exam ID in localStorage for the result page to use
    if (exam.attempt_id) {
      localStorage.setItem('attemptID', exam.attempt_id);
    }
    if (exam.exam_id) {
      localStorage.setItem('exam-id', exam.exam_id);
    }
    window.location.href = '/complete_result';
  };

  useEffect(() => {
    const fetchExamHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}/results/get_all_student_results/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch exam history');
        const data = await response.json();
        setExamHistory(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch exam history');
        setExamHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExamHistory();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-12 px-4"
      style={{ background: THEME.gradient, backgroundSize: "400% 400%" }}
    >
      <div className="w-full max-w-5xl bg-[#050014]/90 rounded-3xl shadow-2xl p-10 mt-8 border-2 border-[#1a0066]" style={{ boxShadow: `0 0 32px ${THEME.accent1}` }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-transparent bg-clip-text mb-2 md:mb-0">
            Exam History
          </h1>
          <div className="flex items-center gap-2 bg-[#1a0066]/60 rounded-xl px-4 py-2 border border-[#00fff7]">
            <FaSearch className="text-[#00fff7]" />
            <input
              type="text"
              placeholder="Search exams..."
              className="bg-transparent outline-none text-[#e0e0ff] placeholder-[#7f00ff] w-40 md:w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl">
          {loading ? (
            <div className="text-center text-[#00fff7] py-8 text-lg">Loading exam history...</div>
          ) : error ? (
            <div className="text-center text-red-400 py-8 text-lg">{error}</div>
          ) : (
            <table className="min-w-full text-left text-[#e0e0ff]">
              <thead>
                <tr className="bg-gradient-to-r from-[#1a0066] to-[#050014]">
                  <th className="py-3 px-6 font-semibold">Exam</th>
                  <th className="py-3 px-6 font-semibold">Type</th>
                  <th className="py-3 px-6 font-semibold">Date</th>
                  <th className="py-3 px-6 font-semibold">Status</th>
                  <th className="py-3 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {examHistory.map((exam) => (
                  <tr
                    key={exam.id || exam.exam_id || exam.exam_title}
                    className="border-b border-[#1a0066] hover:bg-[#1a0066]/40 transition-colors"
                  >
                    <td className="py-4 px-6 flex items-center gap-3">
                      <FaFileAlt className="text-[#00fff7]" />
                      <span className="font-bold">{exam.exam_title || exam.title}</span>
                    </td>
                    <td className="py-4 px-6">{exam.type || exam.exam_type || '-'}</td>
                    <td className="py-4 px-6 flex items-center gap-2">
                      <FaCalendarAlt className="text-[#ff00ea]" />
                      {exam.created_at ? new Date(exam.created_at).toLocaleDateString() : '-' }
                    </td>
                    <td className={`py-4 px-6 font-semibold flex items-center gap-2 ${statusColor(exam.status || exam.result_status || '-')}`}> 
                      {(exam.status === "Completed" || exam.result_status === "Completed") && <FaCheckCircle />}
                      {(exam.status === "In Progress" || exam.result_status === "In Progress") && <FaTimesCircle />}
                      {exam.status || exam.result_status || '-'}
                    </td>
                    <td className="py-4 px-6">
                      <button className="px-4 py-2 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black rounded-lg font-bold shadow hover:scale-105 transition-all text-sm" onClick={() => handleViewDetails(exam)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!loading && !error && examHistory.length === 0 && (
          <div className="text-center text-[#7f00ff] mt-8 text-lg">No exam history found.</div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage; 