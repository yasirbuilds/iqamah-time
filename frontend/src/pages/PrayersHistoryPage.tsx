import React from "react";
import Header from "../components/layout/Header";
import MobileBottomNavigation from "../components/layout/MobileBottomNavigation";
import StatisticSection from "../components/sections/StatisticSection";
import PrayerHistorySection from "../components/sections/PrayerHistorySection";

const PrayersHistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="md:hidden absolute bottom-0 -left-12 w-[250px] h-[300px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,_#CCAC2A,_#FDD535)] blur-[110px] z-0" />
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <PrayerHistorySection />
        <StatisticSection />
      </main>
      <MobileBottomNavigation />
    </div>
  );
};

export default PrayersHistoryPage;
