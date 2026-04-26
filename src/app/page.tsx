import HeroSection from "@/components/HeroSection";
import LandingSections from "@/components/LandingSections";
import FeaturesSection from "@/components/FeaturesSection";
import SocialProof from "@/components/SocialProof";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <LandingSections />
      <FeaturesSection />
      <SocialProof />
      <Footer />
    </main>
  );
}
