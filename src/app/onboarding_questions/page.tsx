"use client"
import { useState } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import { API_BASE_URL } from '@/utils/apiConfig';
import {
  FaMale,
  FaFemale,
  FaGlobe,
  FaUserGraduate,
  FaBrain,
  FaAward,
  FaRunning,
  FaFlagCheckered,
  FaMedal,
} from "react-icons/fa";
import THEME from "../components/Landing Page/theme";
import LandingBackground from "../components/Landing Page/LandingBackground";
import Image from "next/image";
import Link from "next/link";

const questions = [
  {
    id: "age",
    question: "What is your age group?",
    options: ["Under 10", "10-15", "16-20", "21+"],
    icons: [<FaUserGraduate />, "🎉", "🎓", "🏆"],
  },
  {
    id: "gender",
    question: "What is your gender?",
    options: ["Male", "Female", "Other"],
    icons: [<FaMale />, <FaFemale />, "🌈"],
  },
  {
    id: "country",
    question: "Which country are you from?",
    options: ["United States", "India", "United Kingdom", "Other"],
    icons: [<FaGlobe />, "🇮🇳", "🇬🇧", "🌍"],
  },
  {
    id: "social_interaction_style",
    question: "What is your social interaction style?",
    options: ["Introvert", "Extrovert", "Ambivert"],
    icons: ["📖", "🎤", "⚖️"],
  },
  {
    id: "decision_making_approach",
    question: "How do you make decisions?",
    options: ["Thinker", "Feeler"],
    icons: [<FaBrain />, "❤️"],
  },
  {
    id: "current_level_of_education",
    question: "What is your current level of education?",
    options: ["Primary School", "High School", "Undergraduate", "Other"],
    icons: ["📚", "✏️", "🎓", "🌟"],
  },
  {
    id: "last_grade",
    question: "What was your last grade?",
    options: ["A+", "A", "B", "Other"],
    icons: [<FaMedal />, "📊", "📜", "🌟"],
  },
  {
    id: "favorite_subject",
    question: "What is your favorite subject?",
    options: ["Mathematics", "Science", "History", "Other"],
    icons: ["📐", "🔬", "📜", "🌟"],
  },
  {
    id: "interested_career_paths",
    question: "What career path interests you the most?",
    options: ["Engineering", "Medicine", "Law", "Other"],
    icons: ["⚙️", "💉", "⚖️", "🌟"],
  },
  {
    id: "free_time_activities",
    question: "What do you like to do in your free time?",
    options: ["Sports", "Reading", "Gaming", "Other"],
    icons: [<FaRunning />, "📚", "🎮", "🌟"],
  },
  {
    id: "motivation_to_study",
    question: "What motivates you to study?",
    options: ["grades", "knowledge", "personal growth", "Other"],
    icons: [<FaAward />, "📘", "🏆", "✨"],
  },
  {
    id: "short_term_academic_goals",
    question: "What is your short-term academic goal?",
    options: ["Improve Grades", "Learn a Skill", "Pass Exams", "Other"],
    icons: ["📊", "🛠️", "🎓", "🌟"],
  },
  {
    id: "long_term_academic_goals",
    question: "What is your long-term academic goal?",
    options: ["Graduate College", "Build Career", "Start a Business", "Other"],
    icons: [<FaFlagCheckered />, "📈", "💼", "🌟"],
  },
];

const additionalOptions: Record<string, string[]> = {
  country : ["Canada","United Kingdom","Australia","Germany","France","Italy","Spain","Brazil","Mexico","Japan","China","India","Pakistan","Russia","South Africa","Nigeria","Egypt","Turkey","Saudi Arabia","Argentina","South Korea","New Zealand","Sweden","Norway","Denmark","Netherlands","Belgium","Switzerland","United Arab Emirates","Malaysia","Singapore","Indonesia","Philippines","Thailand"],
  current_level_of_education : ["Kindergarten","Primary School","Middle School","High School","Undergraduate","Postgraduate","Doctorate","Other"],
  last_grade : ["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","D-","F","I","P","F","Other"],
  favorite_subject: ["English", "Geography", "Art", "Music" , "Computer Science" , "Physical Education" , "Language"],

  interested_career_paths: ["Business","Technology","Science","Education","Finance","Hospitality","Healthcare","Environmental Science","Media and Communications","Psychology","Social Work","Entrepreneurship","Sports","Government and Politics" ,"Other"],
  motivation_to_study: ["curiosity","peer competition"]
};

const Onboarding = () => {
  const router = useRouter(); // Initialize router
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);
  const [selectedAdditionalOption, setSelectedAdditionalOption] = useState("");
  const [loading, setLoading] = useState(false); // State for loading
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const current = questions[currentQuestion];

  const handleOptionSelect = (option: string) => {
    const newAnswers = { ...answers, [current.id]: option };
    setAnswers(newAnswers);

    if (option === "Other") {
      setShowAdditionalOptions(true);
    } else {
      setShowAdditionalOptions(false);
    }

    // Log the formatted data after each selection
    const formattedData = {
      "age": newAnswers.age === "Under 10" ? 0 :
             newAnswers.age === "10-15" ? 10 :
             newAnswers.age === "16-20" ? 16 : 21,
      "gender": newAnswers.gender?.toLowerCase() || "",
      "country": newAnswers.country || "",
      "social_interaction_style": newAnswers.social_interaction_style?.toLowerCase() || "",
      "decision_making_approach": newAnswers.decision_making_approach?.toLowerCase() || "",
      "current_level_of_education": newAnswers.current_level_of_education || "",
      "last_grade": newAnswers.last_grade || "",
      "favorite_subject": newAnswers.favorite_subject || selectedAdditionalOption,
      "interested_career_paths": newAnswers.interested_career_paths || selectedAdditionalOption,
      "free_time_activities": newAnswers.free_time_activities || "",
      "motivation_to_study": newAnswers.motivation_to_study?.toLowerCase() || "",
      "short_term_academic_goals": newAnswers.short_term_academic_goals || "",
      "long_term_academic_goals": newAnswers.long_term_academic_goals || ""
    };
    console.log('Current form data:', formattedData);
  };

  const handleAdditionalOptionSelect = (option: string) => {
    setSelectedAdditionalOption(option);
    setShowAdditionalOptions(false);
    handleOptionSelect(option);
  };

  const handleNext = () => {
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    setLoading(true); // Start loading
    try {
      const accessToken = localStorage.getItem('access_token');

      // Convert age to number and other values to match API format
      const formattedData = {
        "age": answers.age === "Under 10" ? 0 :
               answers.age === "10-15" ? 10 :
               answers.age === "16-20" ? 16 : 21,
        "gender": answers.gender.toLowerCase(),
        "country": answers.country,
        "social_interaction_style": answers.social_interaction_style.toLowerCase(),
        "decision_making_approach": answers.decision_making_approach.toLowerCase(),
        "current_level_of_education": answers.current_level_of_education,
        "last_grade": answers.last_grade,
        "favorite_subject": answers.favorite_subject || selectedAdditionalOption,
        "interested_career_paths": answers.interested_career_paths || selectedAdditionalOption,
        "free_time_activities": answers.free_time_activities,
        "motivation_to_study": answers.motivation_to_study.toLowerCase(),
        "short_term_academic_goals": answers.short_term_academic_goals,
        "long_term_academic_goals": answers.long_term_academic_goals
      };

      console.log('Submitting data:', formattedData);

      const response = await fetch(`${API_BASE_URL}/student/create_profile/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(formattedData)
      });

      const data = await response.json();
      console.log('Profile creation response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create profile');
      }

      // Set success message on successful profile creation
      setSuccessMessage("Profile created successfully!");

      // Redirect to Dashboard page on successful profile creation
      router.push('/DashBoard'); // Use router to navigate to the Dashboard

    } catch (error) {
      console.error('Error creating profile:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
      {/* Animated Neon Background */}
      <LandingBackground />
      {/* Neon blurred shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full" style={{ background: THEME.accent2, opacity: 0.3, filter: 'blur(64px)' }}></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full" style={{ background: THEME.accent1, opacity: 0.2, filter: 'blur(64px)' }}></div>
      {/* Progress Bar */}
      <div className="w-full max-w-lg mt-32 mb-6">
        <div className="h-3 rounded-full bg-[#1a0066] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              background: `linear-gradient(90deg, ${THEME.accent1}, ${THEME.accent2}, ${THEME.accent3})`,
              boxShadow: `0 0 16px ${THEME.accent1}`
            }}
          ></div>
        </div>
      </div>
      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-lg mx-auto p-10 rounded-3xl shadow-2xl border-4" style={{ background: 'rgba(10,0,61,0.85)', borderColor: THEME.accent1, boxShadow: `0 0 32px ${THEME.accent1}, 0 0 64px ${THEME.accent2}` }}>
        {/* Question Heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 text-5xl">
            {current.icons && current.icons[0]}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent mb-2 text-center">
            {current.question}
          </h2>
        </div>
        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {current.options.map((option, idx) => (
            <button
              key={option}
              onClick={() => handleOptionSelect(option)}
              className={`flex items-center justify-center gap-3 py-4 px-6 rounded-xl text-lg font-semibold border-2 transition-all duration-300 shadow-lg focus:outline-none
                ${answers[current.id] === option
                  ? 'bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black border-[#00fff7] scale-105'
                  : 'bg-[#050014]/80 text-[#e0e0ff] border-[#1a0066] hover:bg-[#1a0066]/60 hover:border-[#00fff7] hover:scale-105'}`}
              style={{ boxShadow: answers[current.id] === option ? `0 0 16px ${THEME.accent1}` : undefined }}
            >
              <span className="text-2xl">{current.icons && current.icons[idx]}</span>
              {option}
            </button>
          ))}
        </div>
        {/* Additional Options */}
        {showAdditionalOptions && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#00fff7] mb-2">Select an option:</h3>
            <div className="grid grid-cols-2 gap-4">
              {(additionalOptions[current.id] || []).map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAdditionalOptionSelect(opt)}
                  className="py-2 px-4 rounded-lg bg-[#1a0066] text-[#e0e0ff] border-2 border-[#00fff7] hover:bg-[#00fff7] hover:text-black transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
            <button
            onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 rounded-lg bg-[#1a0066] text-[#e0e0ff] border-2 border-[#7f00ff] font-bold shadow-md hover:bg-[#7f00ff] hover:text-black transition-all disabled:opacity-40"
            >
            Previous
            </button>
          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!answers[current.id]}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black font-bold shadow-lg neon-glow hover:scale-105 transition-all duration-300 disabled:opacity-40"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !answers[current.id]}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black font-bold shadow-lg neon-glow hover:scale-105 transition-all duration-300 disabled:opacity-40"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
        {/* Success Message */}
        {successMessage && (
          <div className="mt-6 p-4 rounded-lg bg-[#00fff7]/10 border-l-4 border-[#00fff7] text-[#00fff7] text-center animate-pulse">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
