import React from "react";
import Header from "../components/layout/Header";
import HomeWelcomeSection from "../components/sections/HomeWelcomeSection";
import TodayProgressSection from "../components/sections/TodayProgressSection";
import TodayPrayerSection from "../components/sections/TodayPrayerSection";
import MobileBottomNavigation from "../components/layout/MobileBottomNavigation";
import ComingSoonFeatureSection from "../components/sections/ComingSoonFeatureSection";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white relative z-10 overflow-hidden">
      <div className="absolute md:left-[920px] left-20 md:-top-[400px] top-[0px] md:w-[1000px] md:h-[1080px] w-[500px] h-[600px] rounded-full z-0">
        <img src="/images/Glow.svg" alt="" className="h-full w-full" />
      </div>
      <div className="md:hidden absolute left-20 -bottom-[100px] w-[500px] h-[500px] rounded-full z-0">
        <img src="/images/Glow.svg" alt="" className="h-full w-full" />
      </div>
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 pb-20 md:pb-8 relative z-10">
        <HomeWelcomeSection />
        <TodayProgressSection />
        <TodayPrayerSection />
        <ComingSoonFeatureSection />
      </main>

      <MobileBottomNavigation />
    </div>
  );
};

export default HomePage;
