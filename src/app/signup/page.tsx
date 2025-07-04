"use client";

import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaLock, FaUserGraduate, FaChalkboardTeacher, FaArrowRight } from 'react-icons/fa';
import Image from "next/image";

// Import token utilities
import { isTokenExpired } from "@/utils/isTokenExpired";
import { API_BASE_URL } from '@/utils/apiConfig';
import THEME from "../components/Landing Page/theme";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Default role
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  // useEffect(() => {
  //   const email = localStorage.getItem("email");
  //   const accessToken = localStorage.getItem("access_token");

  //   if (email && accessToken && !isTokenExpired(accessToken)) {
  //     router.push("/dashboard"); // Redirect to dashboard if already logged in
  //   }
  // }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password, role }),
        }
      );

      if (response.ok) {
        setSuccessMessage("Signup successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.detail || "Signup failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up | Technavya AI</title>
        <meta name="description" content="Create your Technavya AI account - Empowering businesses with AI solutions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
        {/* Neon blurred shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full" style={{ background: THEME.accent2, opacity: 0.3, filter: 'blur(64px)' }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full" style={{ background: THEME.accent1, opacity: 0.2, filter: 'blur(64px)' }}></div>
        {/* Glassmorphism card */}
        <div className="relative z-10 w-full max-w-lg mx-auto p-10 rounded-3xl shadow-2xl border-4" style={{ background: 'rgba(10,0,61,0.85)', borderColor: THEME.accent1, boxShadow: `0 0 32px ${THEME.accent1}, 0 0 64px ${THEME.accent2}` }}>
          <nav className="fixed top-0 left-0 w-full z-50 flex items-center px-8 py-4 bg-[#050014]/80 backdrop-blur-md border-b-2 border-[#00fff7] shadow-lg">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="Technavya AI Logo" width={40} height={40} className="drop-shadow" style={{ filter: 'drop-shadow(0 0 8px #00fff7)' }} />
              <span className="text-xl font-bold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent">Technavya AI</span>
            </Link>
          </nav>
          <div className="pt-24">
            <div className="flex flex-col items-center mb-8">
              <Image src="/logo.png" alt="Technavya AI Logo" width={64} height={64} className="mb-4" style={{ filter: 'drop-shadow(0 0 16px #00fff7)' }} />
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent mb-2">Create Your Account</h2>
              <p className="text-base text-[#e0e0ff]">Join Technavya AI and start your personalized journey</p>
            </div>
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-[#ff00ea]/10 border-l-4 border-[#ff00ea] text-[#ff00ea]">
                <p className="text-sm">{error}</p>
              </div>
            )}
            {successMessage && (
              <div className="mb-6 p-4 rounded-lg bg-[#00fff7]/10 border-l-4 border-[#00fff7] text-[#00fff7]">
                <p className="text-sm">{successMessage}</p>
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-[#00fff7] mb-1">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-[#7f00ff]" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 rounded-lg border-2 border-[#1a0066] bg-[#050014]/80 text-[#e0e0ff] placeholder-[#7f00ff]/60 focus:outline-none focus:ring-2 focus:ring-[#00fff7] focus:border-[#00fff7] transition"
                      placeholder="Choose a username"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#00fff7] mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-[#7f00ff]" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 rounded-lg border-2 border-[#1a0066] bg-[#050014]/80 text-[#e0e0ff] placeholder-[#7f00ff]/60 focus:outline-none focus:ring-2 focus:ring-[#00fff7] focus:border-[#00fff7] transition"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#00fff7] mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-[#7f00ff]" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 rounded-lg border-2 border-[#1a0066] bg-[#050014]/80 text-[#e0e0ff] placeholder-[#7f00ff]/60 focus:outline-none focus:ring-2 focus:ring-[#00fff7] focus:border-[#00fff7] transition"
                      placeholder="Create a password"
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#7f00ff]">Password must be at least 8 characters long</p>
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-[#00fff7] mb-1">I am a</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${role === 'student' ? 'border-[#00fff7] bg-[#00fff7]/10 text-[#00fff7]' : 'border-[#1a0066] bg-[#050014]/60 text-[#e0e0ff]'}`}
                      onClick={() => setRole('student')}
                    >
                      <FaUserGraduate className={`h-5 w-5 mr-2 ${role === 'student' ? 'text-[#00fff7]' : 'text-[#7f00ff]'}`} />
                      <span className="font-medium">Student</span>
                      {role === 'student' && (
                        <FaArrowRight className="w-5 h-5 ml-auto text-[#00fff7]" />
                      )}
                    </div>
                    <div
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${role === 'teacher' ? 'border-[#ff00ea] bg-[#ff00ea]/10 text-[#ff00ea]' : 'border-[#1a0066] bg-[#050014]/60 text-[#e0e0ff]'}`}
                      onClick={() => setRole('teacher')}
                    >
                      <FaChalkboardTeacher className={`h-5 w-5 mr-2 ${role === 'teacher' ? 'text-[#ff00ea]' : 'text-[#7f00ff]'}`} />
                      <span className="font-medium">Teacher</span>
                      {role === 'teacher' && (
                        <FaArrowRight className="w-5 h-5 ml-auto text-[#ff00ea]" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
                <button
                  type="submit"
                className="w-full py-3 mt-6 rounded-lg bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black font-bold text-lg shadow-lg neon-glow hover:scale-105 transition-all duration-300"
                  disabled={loading}
                >
                {loading ? "Signing Up..." : "Sign Up"}
                </button>
              <div className="text-center mt-4">
                <span className="text-[#e0e0ff]">Already have an account? </span>
                <Link href="/login" className="text-[#00fff7] underline hover:text-[#ff00ea] transition-colors">Login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
