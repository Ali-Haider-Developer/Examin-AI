"use client"
import { useState, useEffect, useRef } from 'react';
import {
  FaUser, FaUpload, FaPencilAlt, FaClipboardList, FaChartBar, FaSignOutAlt,
  FaBookOpen, FaCheck, FaTimes, FaPercentage, FaStar, FaBars, FaGraduationCap,
  FaChartLine, FaAward, FaCalendarAlt, FaLightbulb, FaBell, FaCog, FaSearch,
  FaHistory
} from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '@/utils/apiConfig';
import withAuth from '@/components/withAuth';
import THEME from "../components/Landing Page/theme";
import LandingBackground from "../components/Landing Page/LandingBackground";
import Image from "next/image";

const ExamList = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hoveredPieIndex, setHoveredPieIndex] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [progressData, setProgressData] = useState({
    total_exams_taken: 0,
    exams_passed: 0,
    exams_failed: 0,
    overall_percentage: 0,
    overall_grade: ''
  });
  const [latestExamResult, setLatestExamResult] = useState({
    exam_title: "",
    total_marks: 0,
    obtained_marks: 0,
    grade: "",
    percentage: 0
  });
  const [allExamResults, setAllExamResults] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}/student_progress/get_latest_progress`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log('Progress data fetched successfully:', data);
        setProgressData({
          total_exams_taken: data.total_exams_taken,
          exams_passed: data.exams_passed,
          exams_failed: data.exams_failed,
          overall_percentage: data.overall_percentage,
          overall_grade: data.overall_grade
        });
      } catch (error) {
        console.error('Error fetching lastest progress data:', error);
      }
    };

    const fetchLatestExamResult = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}/results/get_last_exam_result/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log('Latest exam result fetched successfully:', data);
        setLatestExamResult({
          exam_title: data.exam_title,
          total_marks: data.total_marks,
          obtained_marks: data.obtained_marks,
          grade: data.grade,
          percentage: data.percentage
        });
      } catch (error) {
        console.error('Error fetching latest exam result:', error);
      }
    };

    const fetchAllExamResults = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}/results/get_all_student_results/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log('All exam results fetched successfully:', data);
        // Ensure data is an array before setting state
        setAllExamResults(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching all exam results:', error);
        setAllExamResults([]); // Set empty array on error
      }
    };

    fetchProgressData();
    fetchLatestExamResult();
    fetchAllExamResults();
  }, []);

  const menuItems = [
    { icon: <FaBookOpen className="w-6 h-6" />, label: 'Dashboard', href: '/' },
    { icon: <FaUpload className="w-6 h-6" />, label: 'Upload Content', href: '/ContentUpload' },
    { icon: <FaPencilAlt className="w-6 h-6" />, label: 'Generate Exam', href: '/ContentUpload' },
    { icon: <FaUser className="w-6 h-6" />, label: 'Profile', href: '/Profile' },
  ];

  // Process exam results for charts
  const lastTenExams = [...allExamResults]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)
    .reverse()
    .map(exam => ({
      name: exam.exam_title,
      percentage: exam.percentage,
      grade: exam.grade
    }));

  const performanceData = allExamResults.map(exam => ({
    name: exam.exam_title,
    percentage: exam.percentage,
    grade: exam.grade
  }));

  const passFailData = [
    { name: 'Pass', value: progressData.exams_passed },
    { name: 'Fail', value: progressData.exams_failed }
  ];

  const COLORS = ['#4CAF50', '#FF5252'];

  const onPieEnter = (_: any, index: number) => {
    setHoveredPieIndex(index);
  };

  const onPieLeave = () => {
    setHoveredPieIndex(null);
  };

  const handleNavigation = (label: string) => {
    setActiveTab(label.toLowerCase());
    if (label.toLowerCase() === 'profile') {
      router.push('/components/Profile');
    }
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <path
          d={`M ${cx},${cy} L ${cx + outerRadius * Math.cos(startAngle)},${
            cy + outerRadius * Math.sin(startAngle)
          } A ${outerRadius},${outerRadius} 0 0 1 ${
            cx + outerRadius * Math.cos(endAngle)
          },${cy + outerRadius * Math.sin(endAngle)} Z`}
          fill={fill}
          className="transition-all duration-300 ease-in-out"
          transform={hoveredPieIndex !== null ? `scale(1.1) translate(-${cx * 0.1},-${cy * 0.1})` : 'scale(1)'}
        />
      </g>
    );
  };

  return (
    <div className="relative min-h-screen flex" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
      {/* Animated Neon Background */}
      <LandingBackground />
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isCollapsed ? 'w-24' : 'w-72'}`}
        style={{ background: 'rgba(10,0,61,0.85)', borderRight: `2px solid ${THEME.accent1}`, boxShadow: `0 0 32px ${THEME.accent1}, 0 0 64px ${THEME.accent2}` }}>
        {/* Logo */}
        <div className="p-6 border-b border-[#1a0066] flex items-center gap-3">
          <Image src="/logo.png" alt="Examin-AI  Logo" width={40} height={40} style={{ filter: 'drop-shadow(0 0 8px #00fff7)' }} />
          {!isCollapsed && <span className="text-xl font-bold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent">Examin-AI</span>}
        </div>
        {/* Menu Items */}
        <nav className="p-4 mt-2">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href}>
                  <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-start'} items-center gap-4 text-[#e0e0ff] hover:text-black hover:bg-gradient-to-r hover:from-[#00fff7] hover:to-[#ff00ea] rounded-xl p-3 transition-all duration-200 group border-2 border-transparent hover:border-[#00fff7]`}
                    style={activeTab === item.label.toLowerCase() ? { background: THEME.accent1, color: '#050014', borderColor: THEME.accent2, boxShadow: `0 0 16px ${THEME.accent1}` } : {}}>
                    <span className="text-2xl">{item.icon}</span>
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Logout Button */}
        <div className="absolute bottom-8 left-0 right-0 px-4">
          <Link href="/logout">
            <button className="flex items-center gap-4 text-[#e0e0ff] hover:text-black hover:bg-gradient-to-r hover:from-[#ff00ea] hover:to-[#00fff7] rounded-xl p-3 w-full border-2 border-transparent hover:border-[#ff00ea] transition-all">
              <FaSignOutAlt className="text-2xl" />
              {!isCollapsed && <span className="font-medium">Logout</span>}
            </button>
          </Link>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 pb-12" style={{ marginLeft: isCollapsed ? '96px' : '288px', width: `calc(100% - ${isCollapsed ? '96px' : '288px'})` }}>
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-30 bg-[#050014]/80 backdrop-blur-md border-b-2 border-[#00fff7] px-8 py-4 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff00ea] to-[#00fff7] bg-clip-text text-transparent">Dashboard</h1>
              <p className="text-[#e0e0ff] text-sm">Welcome to your learning analytics</p>
            </div>
          </div>
        </div>
        {/* Welcome Card */}
        <div className="px-8">
          <div className="relative overflow-hidden rounded-2xl shadow-xl mb-8 border-2" style={{ background: 'rgba(10,0,61,0.85)', borderColor: THEME.accent1, boxShadow: `0 0 32px ${THEME.accent1}, 0 0 64px ${THEME.accent2}` }}>
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full" style={{ background: THEME.accent2, opacity: 0.2, filter: 'blur(32px)' }}></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full" style={{ background: THEME.accent1, opacity: 0.1, filter: 'blur(32px)' }}></div>
            <div className="relative p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="text-[#e0e0ff]">
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent">Welcome back, Student!</h2>
                  <p className="text-[#e0e0ff] text-lg">Track your progress and performance all in one place</p>
                  <div className="mt-4 flex items-center space-x-2">
                    <FaCalendarAlt className="text-[#00fff7]" />
                    <span className="text-[#00fff7]">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
                <Link href="/ContentUpload">
                  <button className="bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center space-x-3 group hover:scale-105">
                    <FaPencilAlt className="w-5 h-5" />
                    <span>Generate New Exam</span>
                    <div className="transform translate-x-0 group-hover:translate-x-1 transition-transform">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Performance Cards */}
        <div className="px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[
              { icon: FaBookOpen, label: 'Total Exams', value: progressData.total_exams_taken, color: THEME.accent1, description: 'Exams taken so far' },
              { icon: FaCheck, label: 'Total Pass', value: progressData.exams_passed, color: THEME.accent1, description: 'Successfully passed' },
              { icon: FaTimes, label: 'Total Fail', value: progressData.exams_failed, color: THEME.accent3, description: 'Need improvement' },
              { icon: FaPercentage, label: 'Success Rate', value: `${parseFloat(progressData.overall_percentage?.toFixed(2))}%`, color: THEME.accent2, description: 'Overall success' },
              { icon: FaAward, label: 'Overall Grade', value: progressData.overall_grade, color: THEME.accent3, description: 'Current standing' }
            ].map(({ icon: Icon, label, value, color, description }) => (
              <div key={label} className="p-6 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:scale-105 relative group" style={{ background: 'rgba(10,0,61,0.85)', borderColor: color, boxShadow: `0 0 16px ${color}` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: color, boxShadow: `0 0 16px ${color}` }}>
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-sm font-medium text-[#00fff7]">{label}</h3>
                <p className="text-3xl font-bold text-[#e0e0ff] mt-1">{value}</p>
                <p className="text-xs text-[#7f00ff] mt-2">{description}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Charts Section */}
        <div className="px-8 space-y-8">
          {/* Section Title */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#ff00ea] to-[#00fff7] bg-clip-text text-transparent">Performance Analytics</h2>
              <p className="text-sm text-[#e0e0ff]">Detailed insights into your exam performance</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-sm bg-[#1a0066] border-2 border-[#00fff7] rounded-lg hover:bg-[#00fff7] hover:text-black text-[#e0e0ff] transition-all">This Week</button>
              <button className="px-3 py-1.5 text-sm bg-[#1a0066] border-2 border-[#00fff7] rounded-lg hover:bg-[#00fff7] hover:text-black text-[#e0e0ff] transition-all">This Month</button>
              <button className="px-3 py-1.5 text-sm bg-gradient-to-r from-[#00fff7] to-[#ff00ea] border-2 border-[#00fff7] rounded-lg text-black font-medium transition-all">All Time</button>
            </div>
          </div>
          {/* Pass/Fail Ratio and Latest Exam Result */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pass/Fail Ratio */}
            <div className="p-6 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:scale-105 relative group" style={{ background: 'rgba(10,0,61,0.85)', borderColor: THEME.accent1, boxShadow: `0 0 16px ${THEME.accent1}` }}>
              <h3 className="text-lg font-semibold text-[#00fff7] mb-6">Pass/Fail Ratio</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={passFailData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" onMouseEnter={onPieEnter} onMouseLeave={onPieLeave} activeShape={renderActiveShape} stroke="none">
                      {passFailData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? THEME.accent1 : THEME.accent3} className="transition-transform duration-300" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px #00fff7', padding: '12px', background: 'rgba(10,0,61,0.95)', color: THEME.text }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value, entry, index) => (<span style={{ color: index === 0 ? THEME.accent1 : THEME.accent3, fontWeight: 500 }}>{value}</span>)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between items-center mt-2 text-sm text-[#e0e0ff]">
                <div>Total Exams: {progressData.total_exams_taken}</div>
                <div>Pass Rate: {progressData.total_exams_taken > 0 ? ((progressData.exams_passed / progressData.total_exams_taken) * 100).toFixed(1) : 0}%</div>
              </div>
            </div>
            {/* Latest Exam Result Card */}
            <div className="p-6 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:scale-105 relative group" style={{ background: 'rgba(10,0,61,0.85)', borderColor: THEME.accent2, boxShadow: `0 0 16px ${THEME.accent2}` }}>
              <h3 className="text-lg font-semibold text-[#ff00ea] mb-6">Latest Exam Result</h3>
              <div className="mb-6">
                <h4 className="text-lg font-medium text-[#e0e0ff] mb-4">{latestExamResult.exam_title || 'No exam taken yet'}</h4>
                {/* Progress Circle */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Background Circle */}
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#1a0066" strokeWidth="10" />
                      {/* Progress Circle */}
                      <circle cx="50" cy="50" r="45" fill="none" stroke={latestExamResult.percentage >= 80 ? THEME.accent1 : latestExamResult.percentage >= 60 ? THEME.accent2 : THEME.accent3} strokeWidth="10" strokeDasharray={`${2 * Math.PI * 45 * latestExamResult.percentage / 100} ${2 * Math.PI * 45 * (1 - latestExamResult.percentage / 100)}`} strokeDashoffset={2 * Math.PI * 45 * 0.25} strokeLinecap="round" />
                      {/* Percentage Text */}
                      <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold" fill={THEME.text}>{latestExamResult.percentage}%</text>
                    </svg>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-[#1a0066] p-3 rounded-xl">
                    <p className="text-[#00fff7] text-xs mb-1">Total Marks</p>
                    <p className="text-[#e0e0ff] font-bold text-lg">{latestExamResult.total_marks}</p>
                  </div>
                  <div className="bg-[#1a0066] p-3 rounded-xl">
                    <p className="text-[#00fff7] text-xs mb-1">Obtained</p>
                    <p className="text-[#e0e0ff] font-bold text-lg">{latestExamResult.obtained_marks}</p>
                  </div>
                </div>
              </div>
              <Link href="/complete_result">
                <button className="w-full py-2.5 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] hover:from-[#ff00ea] hover:to-[#00fff7] text-black rounded-xl transition-colors text-sm font-medium shadow-lg">View Complete Results</button>
              </Link>
            </div>
            {/* Skills Radar Chart */}
            <div className="p-6 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:scale-105 relative group" style={{ background: 'rgba(10,0,61,0.85)', borderColor: THEME.accent3, boxShadow: `0 0 16px ${THEME.accent3}` }}>
              <h3 className="text-lg font-semibold text-[#00fff7] mb-6">Skills Assessment</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={[
                    { subject: 'Critical Thinking', A: Math.min(100, progressData.overall_percentage + 10), fullMark: 100 },
                    { subject: 'Problem Solving', A: Math.min(100, progressData.overall_percentage + 5), fullMark: 100 },
                    { subject: 'Knowledge', A: progressData.overall_percentage, fullMark: 100 },
                    { subject: 'Application', A: Math.max(0, progressData.overall_percentage - 5), fullMark: 100 },
                    { subject: 'Analysis', A: Math.min(100, progressData.overall_percentage + 15), fullMark: 100 },
                  ]}>
                    <PolarGrid stroke={THEME.accent4} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: THEME.text, fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: THEME.text }} />
                    <Radar name="Skills" dataKey="A" stroke={THEME.accent1} fill={THEME.accent1} fillOpacity={0.5} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px #00fff7', padding: '12px', background: 'rgba(10,0,61,0.95)', color: THEME.text }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-2">
                <p className="text-sm text-[#e0e0ff]">Based on your exam performance across different skill areas</p>
              </div>
            </div>
          </div>
          {/* All Exams Performance Overview */}
          <div className="p-6 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:scale-105 relative group" style={{ background: 'rgba(10,0,61,0.85)', borderColor: THEME.accent4, boxShadow: `0 0 16px ${THEME.accent4}` }}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[#ff00ea]">Performance Trends</h3>
                <p className="text-sm text-[#e0e0ff]">Your exam performance over time</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 text-xs bg-[#1a0066] border-2 border-[#00fff7] rounded-lg hover:bg-[#00fff7] hover:text-black text-[#e0e0ff] transition-all">Percentage</button>
                <button className="px-3 py-1.5 text-xs bg-gradient-to-r from-[#00fff7] to-[#ff00ea] border-2 border-[#00fff7] rounded-lg text-black font-medium transition-all">All Metrics</button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={THEME.accent1} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={THEME.accent1} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={THEME.accent4} />
                  <XAxis dataKey="name" tick={{ fill: THEME.text, fontSize: 12 }} axisLine={{ stroke: THEME.accent4 }} tickLine={{ stroke: THEME.accent4 }} />
                  <YAxis yAxisId="left" domain={[0, 100]} tick={{ fill: THEME.text, fontSize: 12 }} axisLine={{ stroke: THEME.accent4 }} tickLine={{ stroke: THEME.accent4 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: THEME.text, fontSize: 12 }} axisLine={{ stroke: THEME.accent4 }} tickLine={{ stroke: THEME.accent4 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px #00fff7', padding: '12px', background: 'rgba(10,0,61,0.95)', color: THEME.text }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" formatter={(value, entry, index) => (<span style={{ color: index === 0 ? THEME.accent1 : THEME.accent2, fontWeight: 500 }}>{value}</span>)} />
                  <Area yAxisId="left" type="monotone" dataKey="percentage" stroke={THEME.accent1} strokeWidth={3} fill="url(#colorPercentage)" name="Percentage" activeDot={{ r: 8, strokeWidth: 0, fill: THEME.accent1 }} dot={{ r: 4, strokeWidth: 0, fill: THEME.accent1 }} />
                  <Line yAxisId="right" type="monotone" dataKey="grade" stroke={THEME.accent2} strokeWidth={3} name="Grade" dot={{ r: 4, strokeWidth: 0, fill: THEME.accent2 }} activeDot={{ r: 8, strokeWidth: 0, fill: THEME.accent2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ExamList);
