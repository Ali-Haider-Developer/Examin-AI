"use client";

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from '@/utils/apiConfig';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import Image from "next/image";
import THEME from "../components/Landing Page/theme";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [redirectReason, setRedirectReason] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if there's a redirect reason in the URL
    const params = new URLSearchParams(window.location.search);
    const reason = params.get('reason');

    if (reason === 'session_expired') {
      setRedirectReason('Your session has expired. Please log in again.');
    } else if (reason === 'auth_required') {
      setRedirectReason('Please log in to access that page.');
    }
  }, []);

  const checkUserProfile = async (token: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/student/get_student_profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // If profile exists, redirect to the dashboard
        router.push("/DashBoard");
      } else {
        const errorData = await response.json();
        if (errorData.detail === "Student profile not found.") {
          // If no profile exists, redirect to the onboarding page
          router.push("/onboarding_questions");
        } else {
          throw new Error("Unexpected error during profile check.");
        }
      }
    } catch (err) {
      console.error("Error checking user profile:", err);
      setError("Failed to verify user profile. Please try again.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access_token); // Save access token to local storage
        setSuccessMessage("Login successful! Verifying profile...");

        // Check if the user has a profile
        await checkUserProfile(data.access_token);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Invalid login credentials.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Technavya AI</title>
        <meta name="description" content="Login to Technavya AI - Empowering businesses with AI solutions" />
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
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent mb-2">Welcome Back</h2>
              <p className="text-base text-[#e0e0ff]">Sign in to your Technavya AI account</p>
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
            {redirectReason && (
              <div className="mb-6 p-4 rounded-lg bg-[#ff00ea]/10 border-l-4 border-[#ff00ea] text-[#ff00ea]">
                <p className="text-sm">{redirectReason}</p>
              </div>
            )}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
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
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              </div>
                <button
                  type="submit"
                className="w-full py-3 mt-6 rounded-lg bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black font-bold text-lg shadow-lg neon-glow hover:scale-105 transition-all duration-300"
                  disabled={loading}
                >
                {loading ? "Logging In..." : "Login"}
                </button>
              <div className="text-center mt-4">
                <span className="text-[#e0e0ff]">Don't have an account? </span>
                <Link href="/signup" className="text-[#00fff7] underline hover:text-[#ff00ea] transition-colors">Sign Up</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
