import { useEffect } from "react";
import Navbar from "../components/landing_page/TopNavBar";
import HeroSection from "../components/landing_page/HeroSection";
import HowItWorks from "../components/landing_page/HowItWorks";
import Mission from "../components/landing_page/Mission";
import Footer from "../components/landing_page/Footer";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <Mission />
      <Footer />
    </main>
  );
}