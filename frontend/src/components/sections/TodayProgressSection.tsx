import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";

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

const TodayProgressSection = () => {
  const [prayerTimes, setPrayerTimes] = useState<Prayer[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const fetchTodaysPrayers = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");

      const response = await fetch(
        "https://iqamah-time-production.up.railway.app/prayers/today",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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
  }, []);

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

  const completedPrayers = prayerTimes.filter(
    (prayer) => prayer.completed
  ).length;
  const progressPercentage =
    prayerTimes.length > 0 ? (completedPrayers / prayerTimes.length) * 100 : 0;
  return (
    <section className="mb-12">
      <div className="rounded-2xl md:p-8 p-4 shadow-sm bg-[#FDD53526] border border-[#FDD535]/70">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-2xl font-semibold  mb-4 sm:mb-0">
            Today's Progress
          </h3>
          <div className="text-right">
            <span className="block text-3xl font-bold">
              {completedPrayers}/5
            </span>
            <span className="text-sm">Prayers Completed</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-orange-400/70 to-orange-500/90 h-3 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-center  font-medium">
          {completedPrayers === 5
            ? "Alhamdulillah! All prayers completed today!"
            : `${5 - completedPrayers} more prayer${
                5 - completedPrayers !== 1 ? "s" : ""
              } to complete today`}
        </p>
      </div>
    </section>
  );
};

export default TodayProgressSection;
