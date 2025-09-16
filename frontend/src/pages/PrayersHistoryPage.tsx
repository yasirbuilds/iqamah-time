import React from "react";
import Header from "../components/layout/Header";
import MobileBottomNavigation from "../components/layout/MobileBottomNavigation";
import StatisticSection from "../components/sections/StatisticSection";
import PrayerHistorySection from "../components/sections/PrayerHistorySection";

const PrayersHistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
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
