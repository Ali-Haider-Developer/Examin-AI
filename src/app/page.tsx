import Image from "next/image";
import HeroSection from "./components/Landing Page/hero";
import Features from "./components/Landing Page/feature";
import HowItWorks from "./components/Landing Page/work";
import RoleToggle from "./components/Landing Page/toggle";
import InteractiveDemo from "./components/Landing Page/video";
import MissionSection from "./components/Landing Page/MissionSection";
import FAQSection from "./components/Landing Page/Faqs";
import CTASection from "./components/Landing Page/cta";
import Footer from "./components/Landing Page/footer";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Features />
      <MissionSection />
      <HowItWorks />
      <RoleToggle />
      <InteractiveDemo />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
