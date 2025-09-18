import { CheckCircle, Circle, Loader2, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import PrayerSelectionModal from "../PrayerSelectionModal";

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
      return "backdrop-blur-lg bg-green-500/20 border-l-4 border-green-400";
    case "ALONE":
      return "backdrop-blur-lg bg-blue-500/20 border-l-4 border-blue-400";
    case "QAZAH":
      return "backdrop-blur-lg bg-rose-500/20 border-l-4 border-rose-400";
    case "MISSED":
      return "backdrop-blur-lg bg-gray-500/20 border-l-4 border-gray-400";
    default:
      return "backdrop-blur-lg border-l-4 border-[#FDD535]/70 bg-[#FDD53526]";
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

const getPrayerIconColor = (prayerType: string | null) => {
  switch (prayerType) {
    case "JAMMAT":
      return "text-green-500";
    case "ALONE":
      return "text-blue-500";
    case "QAZAH":
      return "text-rose-500";
    case "MISSED":
      return "text-gray-500";
    default:
      return "text-[#FDD535]";
  }
};

const TodayPrayerSection = () => {
  const [prayerTimes, setPrayerTimes] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [updating, setUpdating] = useState(false);

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

      const response = await fetch(
        "https://iqamah-time-production.up.railway.app/prayers",
        {
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
        }
      );

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

      const response = await fetch(
        `https://iqamah-time-production.up.railway.app/prayers/${prayerId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prayerType,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update prayer");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating prayer:", error);
      throw error;
    }
  };

  // Fetch today's prayers from API
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

  useEffect(() => {
    fetchTodaysPrayers();
  }, []);

  const retryFetch = async () => {
    try {
      await fetchTodaysPrayers();
      toast.success("Prayer records updated successfully!");
    } catch (err) {
      toast.error("Still unable to load prayer times.");
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
        toast.success(
          `${selectedPrayer.name} prayer status saved as ${getPrayerStatusLabel(
            status
          )}`
        );
      } else if (selectedPrayer.id) {
        // Update existing prayer
        await updatePrayer(selectedPrayer.id, status);
        toast.success(
          `${
            selectedPrayer.name
          } prayer status updated to ${getPrayerStatusLabel(status)}`
        );
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
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold ">Today's Prayer</h3>
        {error && (
          <button
            onClick={retryFetch}
            className="flex items-center gap-2 transition-colors duration-200"
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
                <div className="flex flex-col items-center justify-center min-h-[50px]">
                  <h4 className="text-lg">{prayer.name}</h4>
                  {prayer.prayerType && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-opacity-70">
                      {getPrayerStatusLabel(prayer.prayerType)}
                    </span>
                  )}
                </div>
                <div>
                  {prayer.completed ? (
                    <CheckCircle
                      className={`w-6 h-6 ${getPrayerIconColor(
                        prayer.prayerType || null
                      )}`}
                    />
                  ) : (
                    <Circle
                      className={`w-6 h-6 ${getPrayerIconColor(
                        prayer.prayerType || null
                      )}`}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
    </section>
  );
};

export default TodayPrayerSection;
