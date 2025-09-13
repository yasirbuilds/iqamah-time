import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  CheckCircle,
  Circle,
  BookOpen,
  Compass,
  Calendar,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import Header from "../components/layout/Header";

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

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [prayerTimes, setPrayerTimes] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch today's prayers from API
  useEffect(() => {
    const fetchTodaysPrayers = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("token");

        const response = await fetch("http://localhost:5000/prayers/today", {
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

    fetchTodaysPrayers();
  }, []);

  const retryFetch = () => {
    const fetchTodaysPrayers = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("token");

        const response = await fetch("http://localhost:5000/prayers/today", {
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
          toast.success("Prayer times updated successfully!");
        } else {
          throw new Error("Failed to fetch prayer times");
        }
      } catch (err) {
        toast.error("Still unable to load prayer times.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodaysPrayers();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 !mb-2">
            <span>Assalamu Alaikum, {user?.name?.split(" ")[0]}!</span>
          </h2>
          <p className="text-lg text-gray-600 italic">
            May Allah bless your day with peace and guidance
          </p>
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
                  className={`bg-white rounded-xl p-6 shadow-sm border transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${
                    prayer.completed
                      ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {prayer.name}
                      </h4>
                      <p className="text-gray-600 font-medium">{prayer.time}</p>
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

        {/* Quick Actions */}
        <section>
          <h3 className="text-2xl font-semibold text-gray-900 !mb-6">
            Other Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="!bg-white rounded-xl !p-6 shadow-sm border border-gray-200 hover:bg-gray-50 hover:border-indigo-300 hover:shadow-md transition-all duration-200 hover:-translate-y-1 group">
              <div className="flex flex-col items-center text-center gap-3">
                <RotateCcw className="w-8 h-8 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                <span className="font-medium text-gray-700 group-hover:text-indigo-700">
                  Dhikr Counter
                </span>
              </div>
            </button>
            <button className="!bg-white rounded-xl !p-6 shadow-sm border border-gray-200 hover:bg-gray-50 hover:border-indigo-300 hover:shadow-md transition-all duration-200 hover:-translate-y-1 group">
              <div className="flex flex-col items-center text-center gap-3">
                <BookOpen className="w-8 h-8 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                <span className="font-medium text-gray-700 group-hover:text-indigo-700">
                  Quran Reading
                </span>
              </div>
            </button>
            <button className="!bg-white rounded-xl !p-6 shadow-sm border border-gray-200 hover:bg-gray-50 hover:border-indigo-300 hover:shadow-md transition-all duration-200 hover:-translate-y-1 group">
              <div className="flex flex-col items-center text-center gap-3">
                <Compass className="w-8 h-8 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                <span className="font-medium text-gray-700 group-hover:text-indigo-700">
                  Qibla Direction
                </span>
              </div>
            </button>
            <button className="!bg-white rounded-xl !p-6 shadow-sm border border-gray-200 hover:bg-gray-50 hover:border-indigo-300 hover:shadow-md transition-all duration-200 hover:-translate-y-1 group">
              <div className="flex flex-col items-center text-center gap-3">
                <Calendar className="w-8 h-8 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                <span className="font-medium text-gray-700 group-hover:text-indigo-700">
                  Prayer History
                </span>
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
