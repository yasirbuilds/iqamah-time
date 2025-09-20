import { CheckCircle, Circle, Loader2, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatDateForAPI } from "../../utils/formatDate";
import { fetchPrayersByDate } from "../../api/prayerApi";
import { getPrayerStatusLabel } from "../../utils/prayerStatus";
import type { ApiPrayer, Prayer } from "../../types";
import { ALL_PRAYERS, PRAYER_DISPLAY_NAMES } from "../../utils";

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

interface TodayPrayerSectionProps {
  selectedDate: Date;
  onOpenModal: (prayer: Prayer) => void;
}

const TodayPrayerSection: React.FC<TodayPrayerSectionProps> = ({
  selectedDate,
  onOpenModal,
}) => {
  const [prayerTimes, setPrayerTimes] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform API response to frontend format
  const transformPrayerData = (apiPrayers: ApiPrayer[]): Prayer[] => {
    return apiPrayers.map((prayer) => ({
      id: prayer.id || `temp-${prayer.prayerName}`,
      name:
        PRAYER_DISPLAY_NAMES[
          prayer.prayerName as keyof typeof PRAYER_DISPLAY_NAMES
        ] || prayer.prayerName,
      completed: !!prayer.prayerType && prayer.prayerType !== "MISSED",
      prayerName: prayer.prayerName,
      prayerType: prayer.prayerType,
    }));
  };

  // Fetch prayers for selected date from API
  const fetchTodaysPrayers = async () => {
    try {
      setLoading(true);
      const dateString = formatDateForAPI(selectedDate);

      const prayersArray = await fetchPrayersByDate(dateString);

      // Create a complete list of prayers for the selected date
      const allPrayers = ALL_PRAYERS.map((prayerName) => {
        const existingPrayer = prayersArray.find(
          (p: any) => p.prayerName === prayerName
        );
        return {
          prayerName,
          prayerType: existingPrayer?.prayerType || null,
          id: existingPrayer?.id || null,
          date: dateString,
        };
      });

      const transformedPrayers = transformPrayerData(allPrayers);
      setPrayerTimes(transformedPrayers);
      setError(null);
    } catch (err) {
      console.error("Error fetching prayers:", err);
      setError("Failed to load prayer times");
      toast.error("Failed to load prayer times. Using sample data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysPrayers();
  }, [selectedDate]);

  const retryFetch = async () => {
    try {
      await fetchTodaysPrayers();
      toast.success("Prayer records updated successfully!");
    } catch (err) {
      toast.error("Still unable to load prayer times.");
    }
  };

  // Handle prayer card click
  const handlePrayerClick = (prayer: Prayer) => {
    onOpenModal(prayer);
  };

  // Format date for section title
  const formatDateTitle = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today's Prayer";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday's Prayer";
    } else {
      return `${date.toLocaleDateString("en-US", {
        year: "numeric",
        weekday: "long",
        month: "long",
        day: "numeric",
      })}`;
    }
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">
          {formatDateTitle(selectedDate)}
        </h3>
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
    </section>
  );
};

export default TodayPrayerSection;
