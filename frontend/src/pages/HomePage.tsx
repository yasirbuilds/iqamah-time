import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { CheckCircle, Circle, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import Header from "../components/layout/Header";
import MobileBottomNavigation from "../components/layout/MobileBottomNavigation";
import ComingSoonFeatureSection from "../components/sections/ComingSoonFeatureSection";
import PrayerSelectionModal from "../components/PrayerSelectionModal";
import moment from "moment-hijri";

interface Prayer {
  id: string | null;
  name: string;
  time: string;
  completed: boolean;
  prayerName?: string;
  prayerType?: string | null;
}

interface ApiPrayer {
  id: string | null;
  prayerName: string;
  prayerType: string | null;
  date: string;
}

interface TodayPrayersResponse {
  prayers: ApiPrayer[];
}

const PRAYER_TIMES = {
  FAJR: "05:30 AM",
  DHUHR: "12:45 PM",
  ASR: "04:15 PM",
  MAGHRIB: "06:30 PM",
  ISHA: "08:00 PM",
};

const PRAYER_DISPLAY_NAMES = {
  FAJR: "Fajr",
  DHUHR: "Dhuhr",
  ASR: "Asr",
  MAGHRIB: "Maghrib",
  ISHA: "Isha",
};

// Prayer status colors
const getPrayerCardStyles = (prayerType: string | null) => {
  switch (prayerType) {
    case "JAMMAT":
      return "border-green-200 bg-[#6ff776]";
    case "ALONE":
      return "border-blue-200 bg-[#f7ba5e]";
    case "QAZAH":
      return "border-orange-200 bg-[#f7665c]";
    case "MISSED":
      return "border-red-200 bg-[#cdc6c6]";
    default:
      return "border-gray-200 bg-white";
  }
};

const getPrayerStatusLabel = (prayerType: string | null) => {
  switch (prayerType) {
    case "JAMMAT":
      return "Jamaat";
    case "ALONE":
      return "Alone";
    case "QAZAH":
      return "Qazah";
    case "MISSED":
      return "Missed";
    default:
      return null;
  }
};

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [prayerTimes, setPrayerTimes] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [updating, setUpdating] = useState(false);
  const [englishDate, setEnglishDate] = useState<string>("");
  const [islamicDate, setIslamicDate] = useState<string>("");

  const completedPrayers = prayerTimes.filter(
    (prayer) => prayer.completed
  ).length;
  const progressPercentage =
    prayerTimes.length > 0 ? (completedPrayers / prayerTimes.length) * 100 : 0;

  // Transform API response to frontend format
  const transformPrayerData = (apiPrayers: ApiPrayer[]): Prayer[] => {
    return apiPrayers.map((prayer) => ({
      id: prayer.id || `temp-${prayer.prayerName}`,
      name:
        PRAYER_DISPLAY_NAMES[
          prayer.prayerName as keyof typeof PRAYER_DISPLAY_NAMES
        ] || prayer.prayerName,
      time:
        PRAYER_TIMES[prayer.prayerName as keyof typeof PRAYER_TIMES] ||
        "00:00 AM",
      completed: !!prayer.prayerType, // If prayerType exists, prayer is completed
      prayerName: prayer.prayerName,
      prayerType: prayer.prayerType,
    }));
  };

  // Create prayer API call
  const createPrayer = async (prayerName: string, prayerType: string) => {
    try {
      const token = Cookies.get("token");
      const today = new Date().toISOString().split("T")[0];

      const response = await fetch("https://iqamah-time-production.up.railway.app/prayers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prayerName,
          prayerType,
          date: today,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create prayer");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating prayer:", error);
      throw error;
    }
  };

  // Update prayer API call
  const updatePrayer = async (prayerId: string, prayerType: string) => {
    try {
      const token = Cookies.get("token");

      const response = await fetch(`https://iqamah-time-production.up.railway.app/prayers/${prayerId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prayerType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update prayer");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating prayer:", error);
      throw error;
    }
  };

  // Handle prayer status selection
  const handleStatusSelect = async (status: string) => {
    if (!selectedPrayer) return;

    setUpdating(true);
    try {
      if (selectedPrayer.id && selectedPrayer.id.startsWith("temp-")) {
        // Create new prayer
        await createPrayer(selectedPrayer.prayerName!, status);
        toast.success(`${selectedPrayer.name} prayer status saved as ${getPrayerStatusLabel(status)}`);
      } else if (selectedPrayer.id) {
        // Update existing prayer
        await updatePrayer(selectedPrayer.id, status);
        toast.success(`${selectedPrayer.name} prayer status updated to ${getPrayerStatusLabel(status)}`);
      }

      // Refresh prayer data
      await fetchTodaysPrayers();
      setModalOpen(false);
      setSelectedPrayer(null);
    } catch (error) {
      toast.error("Failed to save prayer status");
    } finally {
      setUpdating(false);
    }
  };

  // Handle prayer card click
  const handlePrayerClick = (prayer: Prayer) => {
    setSelectedPrayer(prayer);
    setModalOpen(true);
  };

  // Fetch today's prayers from API
  const fetchTodaysPrayers = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");

      const response = await fetch("https://iqamah-time-production.up.railway.app/prayers/today", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data: TodayPrayersResponse = await response.json();
        const transformedPrayers = transformPrayerData(data.prayers);
        setPrayerTimes(transformedPrayers);
        setError(null);
      } else {
        throw new Error("Failed to fetch prayer times");
      }
    } catch (err) {
      console.error("Error fetching prayers:", err);
      setError("Failed to load prayer times");
      toast.error("Failed to load prayer times. Using sample data.");

      // Fallback to static data
      setPrayerTimes([
        { id: "1", name: "Fajr", time: "05:30 AM", completed: true },
        { id: "2", name: "Dhuhr", time: "12:45 PM", completed: true },
        { id: "3", name: "Asr", time: "04:15 PM", completed: false },
        { id: "4", name: "Maghrib", time: "06:30 PM", completed: false },
        { id: "5", name: "Isha", time: "08:00 PM", completed: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch today's prayers from API
  useEffect(() => {
    fetchTodaysPrayers();
    
    // Calculate today's dates
    const today = new Date();
    const englishDateStr = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    setEnglishDate(englishDateStr);
    
    // Calculate Islamic date using moment-hijri
    try {
      const hijriDate = moment().format('iD iMMMM iYYYY');
      setIslamicDate(hijriDate);
    } catch (error) {
      console.error('Error calculating Islamic date:', error);
      setIslamicDate('Islamic date unavailable');
    }
  }, []);

  const retryFetch = async () => {
    try {
      await fetchTodaysPrayers();
      toast.success("Prayer times updated successfully!");
    } catch (err) {
      toast.error("Still unable to load prayer times.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 pb-20 md:pb-8">
        {/* Welcome Section */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 !mb-2">
            <span>Assalamu Alaikum, {user?.name?.split(" ")[0]}!</span>
          </h2>
          <p className="text-lg text-gray-600 italic mb-4">
            May Allah bless your day with peace and guidance
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-medium">English Date:</span>
              <span>{englishDate}</span>
            </div>
            <div className="hidden sm:block text-gray-300">|</div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Islamic Date:</span>
              <span>{islamicDate}</span>
            </div>
          </div>
        </section>

        {/* Today's Progress */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">
                Today's Progress
              </h3>
              <div className="text-right">
                <span className="block text-3xl font-bold text-indigo-600">
                  {completedPrayers}/5
                </span>
                <span className="text-sm text-gray-500">Prayers Completed</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-center text-gray-600 font-medium">
              {completedPrayers === 5
                ? "Alhamdulillah! All prayers completed today!"
                : `${5 - completedPrayers} more prayer${
                    5 - completedPrayers !== 1 ? "s" : ""
                  } to complete today`}
            </p>
          </div>
        </section>

        {/* Prayer Times */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              Today's Prayer Times
            </h3>
            {error && (
              <button
                onClick={retryFetch}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors duration-200"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RotateCcw className="w-4 h-4" />
                )}
                Retry
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {prayerTimes.map((prayer) => (
                <div
                  key={prayer.id}
                  onClick={() => handlePrayerClick(prayer)}
                  className={`rounded-xl p-6 shadow-sm border transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer ${getPrayerCardStyles(
                    prayer.prayerType || null
                  )}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {prayer.name}
                      </h4>
                      <p className="text-gray-600 font-medium">{prayer.time}</p>
                      {prayer.prayerType && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-white bg-opacity-70">
                          {getPrayerStatusLabel(prayer.prayerType)}
                        </span>
                      )}
                    </div>
                    <div>
                      {prayer.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <ComingSoonFeatureSection />
      </main>

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

      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation />
    </div>
  );
};

export default HomePage;
