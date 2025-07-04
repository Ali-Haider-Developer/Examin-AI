"use client";

import React from "react";
import THEME from "./theme";
import Hero from "./hero";
import MissionSection from "./MissionSection";
import FeatureSection from "./feature";
import HowItWorks from "./work";
import VideoDemoSection from "./video";
import CTASection from "./cta";
import FAQSection from "./Faqs";
import Footer from "./footer";

const LandingPage = () => {
  return (
    <div style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
      <Hero />
      <MissionSection />
      <FeatureSection />
      <HowItWorks />
      <VideoDemoSection />
      <CTASection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default LandingPage; 