'use client'
import {
  FaUser, FaGraduationCap, FaBriefcase, FaMapMarkerAlt, FaCalendarAlt,
  FaVenusMars, FaBook, FaLightbulb, FaChartLine, FaCog, FaEdit
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '../components/SiderBar/page';
import { API_BASE_URL } from '@/utils/apiConfig';
import withAuth from '@/components/withAuth';
import THEME from '../components/Landing Page/theme';

const ProfilePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [showDashboard, setShowDashboard] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    age: 0,
    gender: "",
    country: "",
    social_interaction_style: "",
    decision_making_approach: "",
    current_level_of_education: "",
    last_grade: "",
    favorite_subject: "",
    interested_career_paths: "",
    free_time_activities: "",
    motivation_to_study: "",
    short_term_academic_goals: "",
    long_term_academic_goals: "",
    id: "",
    name: "",
    email: "",
    profile_summary: "",
    created_at: "",
    updated_at: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/student/get_student_profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        setProfileData(data);
        setError(null);
        console.log('Profile fetched successfully:', data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching profile:', error.message);
        } else {
          console.error('Error fetching profile:', error);
        }
        setError('Failed to load profile data. Please try again later.');
      }
    };

    fetchProfile();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
        <div className="bg-[#1a0066]/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center border-2 border-[#ff00ea] max-w-md w-full">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff00ea] to-[#00fff7] text-transparent bg-clip-text mb-4">Error</h1>
          <p className="text-[#e0e0ff] mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
      <Sidebar />
      <div className="flex-1 p-8 lg:ml-60">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-30 bg-[#1a0066]/80 backdrop-blur-lg border-b-2 border-[#00fff7]/30 px-6 py-4 mb-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-transparent bg-clip-text">My Profile</h1>
              <p className="text-[#e0e0ff] text-sm">View and manage your personal information</p>
            </div>
            <div className="flex items-center space-x-3">
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-[#1a0066]/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden mb-8 border-2 border-[#00fff7]">
          <div className="h-32 bg-gradient-to-r from-[#00fff7]/30 via-[#1a0066]/80 to-[#ff00ea]/30 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="h-32 w-32 rounded-full border-4 border-[#00fff7] bg-gradient-to-br from-[#00fff7] to-[#ff00ea] flex items-center justify-center text-4xl font-extrabold text-black shadow-xl">
                {profileData.name ? profileData.name.charAt(0).toUpperCase() : ''}
              </div>
            </div>
          </div>
          <div className="pt-20 pb-6 px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#e0e0ff]">{profileData.name || 'Student Name'}</h2>
                <div className="flex items-center mt-1 text-[#00fff7]">
                  <FaMapMarkerAlt className="text-[#ff00ea] mr-1" />
                  <span>{profileData.country || 'Location'}</span>
                  <span className="mx-2">•</span>
                  <span>{profileData.email || 'email@example.com'}</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center">
                <div className="bg-[#ff00ea]/20 text-[#ff00ea] px-3 py-1 rounded-full text-sm font-medium border-2 border-[#ff00ea]">
                  {profileData.current_level_of_education || 'Student'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-[#1a0066]/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 border-2 border-[#00fff7]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00fff7] to-[#ff00ea] flex items-center justify-center">
              <FaLightbulb className="text-black text-2xl" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-transparent bg-clip-text">Profile Summary</h2>
          </div>
          <p className="text-[#e0e0ff] leading-relaxed">
            {profileData.profile_summary ||
            "This is your profile summary. It provides an overview of your academic background, learning preferences, and career goals. This information helps ExaminieAI personalize your learning experience."}
          </p>
        </div>

        {/* Details Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DetailCard
            title="Personal Information"
            icon={<FaUser className="text-[#00fff7]" />}
            color="emerald"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem icon={<FaCalendarAlt className="text-[#ff00ea]" />} label="Age" value={profileData.age} />
              <DetailItem icon={<FaVenusMars className="text-[#00fff7]" />} label="Gender" value={profileData.gender} />
              <DetailItem icon={<FaMapMarkerAlt className="text-[#ff00ea]" />} label="Country" value={profileData.country} />
              <DetailItem icon={<FaLightbulb className="text-[#00fff7]" />} label="Free Time Activities" value={profileData.free_time_activities} />
              <DetailItem icon={<FaChartLine className="text-[#ff00ea]" />} label="Motivation to Study" value={profileData.motivation_to_study} />
            </div>
          </DetailCard>

          <DetailCard
            title="Academic Profile"
            icon={<FaGraduationCap className="text-[#ff00ea]" />}
            color="blue"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem icon={<FaGraduationCap className="text-[#00fff7]" />} label="Education Level" value={profileData.current_level_of_education} />
              <DetailItem icon={<FaChartLine className="text-[#ff00ea]" />} label="Last Grade" value={profileData.last_grade} />
              <DetailItem icon={<FaBook className="text-[#00fff7]" />} label="Favorite Subject" value={profileData.favorite_subject} />
              <DetailItem icon={<FaLightbulb className="text-[#ff00ea]" />} label="Short Term Goals" value={profileData.short_term_academic_goals} />
              <DetailItem icon={<FaChartLine className="text-[#00fff7]" />} label="Long Term Goals" value={profileData.long_term_academic_goals} />
            </div>
          </DetailCard>
        </div>

        <div className="mb-8">
          <DetailCard
            title="Career & Interests"
            icon={<FaBriefcase className="text-[#00fff7]" />}
            color="purple"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DetailItem icon={<FaBriefcase className="text-[#ff00ea]" />} label="Career Path" value={profileData.interested_career_paths} />
              <DetailItem icon={<FaUser className="text-[#00fff7]" />} label="Learning Style" value={profileData.social_interaction_style} />
              <DetailItem icon={<FaLightbulb className="text-[#ff00ea]" />} label="Decision Making" value={profileData.decision_making_approach} />
            </div>
          </DetailCard>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <FaCog className="text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Account Information</h2>
            </div>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              Change Password
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Email Address</p>
              <p className="font-medium text-gray-800">{profileData.email || 'email@example.com'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Account Created</p>
              <p className="font-medium text-gray-800">
                {profileData.created_at ? new Date(profileData.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ title, icon, children, color = "emerald" }: { title: string, icon: React.ReactNode, children: React.ReactNode, color?: string }) => (
  <div className={`bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300`}>
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
      <div className={`w-10 h-10 rounded-full bg-${color}-100 flex items-center justify-center`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    </div>
    <div>
      {children}
    </div>
  </div>
);

const DetailItem = ({ icon, label, value }: { icon?: React.ReactNode, label: string, value: string | number }) => (
  <div className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors duration-200">
    <div className="flex items-center gap-2 mb-1">
      {icon && <span className="text-gray-400 text-sm">{icon}</span>}
      <span className="text-gray-500 text-sm">{label}</span>
    </div>
    <span className="text-gray-800 font-medium block">{value || 'Not specified'}</span>
  </div>
);

export default withAuth(ProfilePage);
