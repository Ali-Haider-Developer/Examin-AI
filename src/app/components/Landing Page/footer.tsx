'use client'
import Image from 'next/image'
import Link from 'next/link'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaMoon, FaStar, FaCode, FaHeart, FaRobot, FaRocket, FaBrain } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import THEME from "./theme";
import technavyaLogo from "public/technavya-logo.png";

const Footer = () => {
  const logoUrl = "/logo.png"; // Use a local logo image instead
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Company Info Bar - Neon Gradient and Unified Color Scheme */}
      <div className="w-full flex items-center justify-between px-8 py-4 mb-8 border-t-2 border-b-2 border-[#00fff7]/40" style={{ background: 'linear-gradient(90deg, #00fff7 0%, #ff00ea 100%)', boxShadow: '0 0 24px #00fff7, 0 0 16px #ff00ea' }}>
        {/* Left: Logo and Company Name as a link */}
        <a
          href="https://technavya.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-4 group hover:opacity-90 focus:outline-none"
          style={{ textDecoration: 'none' }}
        >
          <img
            src="/technavya-logo.png"
            alt="Technavya AI Logo"
            className="h-10 w-10 object-contain rounded-full bg-[#050014] p-1 shadow-md border-2 border-[#00fff7]"
            style={{ filter: 'drop-shadow(0 0 12px #00fff7) drop-shadow(0 0 8px #ff00ea)' }}
          />
          <div>
            <div className="font-bold text-lg text-white drop-shadow">Technavya AI</div>
            <div className="text-xs text-[#00fff7] font-medium drop-shadow">Agentic AI Solutions</div>
          </div>
        </a>
        {/* Right: Powered by ... */}
        <div className="flex items-center space-x-2 text-white text-sm font-medium drop-shadow">
          <span>Powered by</span>
          <span className="inline-flex items-center text-[#00fff7]">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20" className="mr-1"><path d="M10.75 2.75a.75.75 0 0 0-1.5 0v2.19a6.5 6.5 0 0 0-5.44 5.44H1.75a.75.75 0 0 0 0 1.5h2.19a6.5 6.5 0 0 0 5.44 5.44v2.18a.75.75 0 0 0 1.5 0v-2.18a6.5 6.5 0 0 0 5.44-5.44h2.18a.75.75 0 0 0 0-1.5h-2.18a6.5 6.5 0 0 0-5.44-5.44V2.75Zm-.75 4.25a4.75 4.75 0 1 1 0 9.5a4.75 4.75 0 0 1 0-9.5Z"/></svg>
          </span>
          <span>from</span>
          <span className="font-bold text-white">Technavya AI</span>
        </div>
      </div>
      {/* Main Footer */}
      <footer className="bg-gradient-to-b from-[#050014] to-[#1a0066] text-[#e0e0ff] pt-16 pb-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00fff7] via-[#ff00ea] to-[#7f00ff]"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#7f00ff]/30 rounded-full opacity-40 blur-lg"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#00fff7]/30 rounded-full opacity-40 blur-lg"></div>

        <div className="container mx-auto px-4 relative z-10">

          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

            {/* Logo & Description */}
            <div className="col-span-1">
              <div className="flex items-center mb-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#00fff7]/20 rounded-full"></div>
                  <Image
                    src={logoUrl}
                    alt="ExaminAI Logo"
                    width={48}
                    height={48}
                    className="relative z-10"
                  />
                </div>
                <h3 className="ml-3 text-2xl font-bold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent">
                  ExaminAI
                </h3>
              </div>
              <p className="text-[#e0e0ff] leading-relaxed">
                Revolutionizing education through AI-driven examination solutions. Create personalized assessments and receive instant feedback.
              </p>

              {/* Social Links */}
              <div className="mt-6 flex space-x-4">
                <a href="https://x.com/Technavya_AI" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0a003d] shadow-md flex items-center justify-center text-[#00fff7] hover:bg-[#1a0066] transition-colors duration-300">
                  <FaXTwitter size={18} />
                </a>
                <a href="https://www.instagram.com/technavya_ai/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0a003d] shadow-md flex items-center justify-center text-[#ff00ea] hover:bg-[#1a0066] transition-colors duration-300">
                  <FaInstagram size={18} />
                </a>
                <a href="https://www.linkedin.com/in/technavya-ai-566213372/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0a003d] shadow-md flex items-center justify-center text-[#7f00ff] hover:bg-[#1a0066] transition-colors duration-300">
                  <FaLinkedin size={18} />
                </a>
                <a href="https://web.facebook.com/profile.php?id=61577894427173" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0a003d] shadow-md flex items-center justify-center text-[#00fff7] hover:bg-[#1a0066] transition-colors duration-300">
                  <FaFacebook size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-span-1">
              <h4 className="text-lg font-bold mb-5 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'Dashboard', href: '/dashboard' },
                  { name: 'Generate Exam', href: '/generate-exam' },
                  { name: 'Profile', href: '/profile' },
                  { name: 'Upload Content', href: '/content-upload' },
                  { name: 'Results', href: '/results' }
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-[#e0e0ff] hover:text-[#00fff7] transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-[#ff00ea] rounded-full mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="col-span-1">
              <h4 className="text-lg font-bold mb-5 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent">
                Resources
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'Help Center', href: '#' },
                  { name: 'Documentation', href: '#' },
                  { name: 'API Reference', href: '#' },
                  { name: 'Privacy Policy', href: '#' },
                  { name: 'Terms of Service', href: '#' }
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-[#e0e0ff] hover:text-[#00fff7] transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-[#ff00ea] rounded-full mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="col-span-1">
              <h4 className="text-lg font-bold mb-5 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent">
                Contact Us
              </h4>
              <div className="space-y-4">
                <p className="text-[#e0e0ff] flex items-start">
                  <span className="w-5 h-5 rounded-full bg-[#7f00ff] flex items-center justify-center mr-3 mt-1">
                    <span className="text-[#00fff7] text-xs"> </span>
                  </span>
                  <span>
                    <a href="mailto:raibadar37218@gmail.com" className="text-[#e0e0ff] hover:text-[#00fff7] transition-colors duration-300">
                      technavyaai@gmail.com
                    </a>
                  </span>
                </p>
                <p className="text-[#e0e0ff] flex items-start">
                  <span className="w-5 h-5 rounded-full bg-[#7f00ff] flex items-center justify-center mr-3 mt-1">
                    <span className="text-[#00fff7] text-xs"> </span>
                  </span>
                  <span>
                    <a href="tel:+923194821372" className="text-[#e0e0ff] hover:text-[#00fff7] transition-colors duration-300">
                      +92 3009216372
                    </a>
                  </span>
                </p>
                <div className="pt-4">
                  <h5 className="text-sm font-semibold text-[#e0e0ff] mb-3">Subscribe to our newsletter</h5>
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="flex-1 px-4 py-2 rounded-l-lg border border-[#1a0066] bg-[#0a003d] text-[#e0e0ff] focus:outline-none focus:ring-2 focus:ring-[#00fff7] focus:border-transparent"
                    />
                    <button className="bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black px-4 py-2 rounded-r-lg hover:from-[#7f00ff] hover:to-[#ff00ea] transition-colors duration-300 neon-glow">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Copyright with Lunar AI Studio attribution */}
          <div className="text-center border-t border-[#1a0066] pt-8">
            <p className="text-[#e0e0ff] mb-2">
              © {currentYear} ExaminAI. All rights reserved.
            </p>
            <p className="text-[#00fff7] text-sm flex items-center justify-center">
              <span>Built by</span>
              <span className="mx-1 font-medium text-[#ff00ea] flex items-center">
                <FaMoon className="text-[#ff00ea] mr-1" size={12} />
                Technavya AI
              </span>
              <span>with</span>
              <FaRocket className="mx-1 text-[#00fff7]" size={12} />
              <span>Agentic AI Technology</span>
            </p>
          </div>

        </div>
      </footer>
    </>
  )
}

export default Footer
