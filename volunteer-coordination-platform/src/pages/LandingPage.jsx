import { useEffect } from "react";
import Navbar from "../components/TopNavBar";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import Mission from "../components/Mission";
import Footer from "../components/Footer";

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