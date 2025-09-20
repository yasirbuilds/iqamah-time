import React, { useState } from "react";
import Header from "../components/layout/Header";
import HomeWelcomeSection from "../components/sections/HomeWelcomeSection";
import TodayProgressSection from "../components/sections/TodayProgressSection";
import TodayPrayerSection from "../components/sections/TodayPrayerSection";
import MobileBottomNavigation from "../components/layout/MobileBottomNavigation";
import ComingSoonFeatureSection from "../components/sections/ComingSoonFeatureSection";
import DateScrollPicker from "../components/DateScrollPicker";
import PrayerSelectionModal from "../components/PrayerSelectionModal";
import { toast } from "sonner";
import Cookies from "js-cookie";
import type { Prayer } from "../types";
import { formatDateForAPI } from "../utils/formatDate";
import { getPrayerStatusLabel } from "../utils/prayerStatus";
import { updatePrayer } from "../api/prayerApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const HomePage: React.FC = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day
  const [selectedDate, setSelectedDate] = useState(today);

  // State for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [updating, setUpdating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleOpenModal = (prayer: Prayer) => {
    setSelectedPrayer(prayer);
    setModalOpen(true);
  };

  // API call functions
  const createPrayer = async (prayerName: string, prayerType: string) => {
    const token = Cookies.get("token");
    const dateString = formatDateForAPI(selectedDate);
    const response = await fetch(`${API_BASE_URL}/prayers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prayerName, prayerType, date: dateString }),
    });
    if (!response.ok) throw new Error("Failed to create prayer");
    return response.json();
  };

  const handleStatusSelect = async (status: string) => {
    if (!selectedPrayer) return;

    setUpdating(true);
    try {
      if (!selectedPrayer.id || selectedPrayer.id.startsWith("temp-")) {
        await createPrayer(selectedPrayer.prayerName!, status);
        toast.success(
          `${selectedPrayer.name} prayer saved as ${getPrayerStatusLabel(
            status
          )}`
        );
      } else {
        await updatePrayer(selectedPrayer.id, status);
        toast.success(
          `${selectedPrayer.name} prayer updated to ${getPrayerStatusLabel(
            status
          )}`
        );
      }
      // Trigger a re-fetch in child components
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Prayer save error:", error);
      toast.error("Failed to save prayer status");
    } finally {
      setUpdating(false);
      setModalOpen(false);
      setSelectedPrayer(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative z-10 overflow-hidden">
      <div className="absolute md:-right-52 right-24 md:top-[20px] top-[200px] md:w-[350px] md:h-[400px] w-[250px] h-[300px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,_#CCAC2A,_#FDD535)] md:blur-[130px] blur-[110px] z-0" />
      <div className="md:hidden absolute left-20 -bottom-[100px] w-[500px] h-[500px] rounded-full z-0">
        <img src="/images/Glow.svg" alt="" className="h-full w-full" />
      </div>
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 pb-20 md:pb-8 relative z-10">
        <HomeWelcomeSection />
        <DateScrollPicker
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
        <TodayProgressSection
          selectedDate={selectedDate}
          key={`progress-${refreshKey}`}
        />
        <TodayPrayerSection
          selectedDate={selectedDate}
          onOpenModal={handleOpenModal}
          key={`prayer-${refreshKey}`}
        />
        <ComingSoonFeatureSection />
      </main>

      <MobileBottomNavigation />

      {/* Prayer Selection Modal */}
      <PrayerSelectionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedPrayer(null);
        }}
        prayerName={selectedPrayer?.name || ""}
        currentStatus={selectedPrayer?.prayerType || null}
        onStatusSelect={handleStatusSelect}
        loading={updating}
      />
    </div>
  );
};

export default HomePage;
