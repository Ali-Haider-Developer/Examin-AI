"use client"
import { FC } from "react";

const CTASection: FC = () => {
  return (
    <section className="relative bg-[#050014] text-[#e0e0ff] py-16 px-4 md:px-8">
      {/* Animated Background using Tailwind CSS (AI Gradient) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00fff7] via-[#7f00ff] to-[#ff00ea] opacity-60 animate-gradient-x" />
      
      <div className="relative z-10 text-center">
        {/* Heading */}
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent">
          Ready to Join Us? Choose Your Path!
        </h2>
        <p className="text-lg mb-8 text-[#00fff7]">
          Whether you're a student or teacher, we have a place for you to grow and contribute.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-6">
          <button
            className="bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black font-bold py-3 px-6 rounded-lg text-xl neon-glow shadow-lg hover:scale-105 transition duration-300"
          >
            Sign Up as Student
          </button>
          <button
            className="bg-gradient-to-r from-[#ff00ea] to-[#00fff7] text-black font-bold py-3 px-6 rounded-lg text-xl neon-glow shadow-lg hover:scale-105 transition duration-300"
          >
            Sign Up as Teacher
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
