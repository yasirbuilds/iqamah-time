import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatDateForAPI } from "../../utils/formatDate";
import { fetchPrayersByDate } from "../../api/prayerApi";
import type { ApiPrayer, Prayer } from "../../types";
import { ALL_PRAYERS, PRAYER_DISPLAY_NAMES } from "../../utils";

interface TodayProgressSectionProps {
  selectedDate: Date;
}

const TodayProgressSection: React.FC<TodayProgressSectionProps> = ({
  selectedDate,
}) => {
  const [prayerTimes, setPrayerTimes] = useState<Prayer[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

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

  // Fetch prayers for selected date from API
  useEffect(() => {
    fetchTodaysPrayers();
  }, [selectedDate]);

  // Transform API response to frontend format
  const transformPrayerData = (apiPrayers: ApiPrayer[]): Prayer[] => {
    return apiPrayers.map((prayer) => ({
      id: prayer.id || `temp-${prayer.prayerName}`,
      name:
        PRAYER_DISPLAY_NAMES[
          prayer.prayerName as keyof typeof PRAYER_DISPLAY_NAMES
        ] || prayer.prayerName,
      completed: !!prayer.prayerType && prayer.prayerType !== "MISSED", // Exclude MISSED from completed
      prayerName: prayer.prayerName,
      prayerType: prayer.prayerType,
    }));
  };

  const completedPrayers = prayerTimes.filter(
    (prayer) => prayer.completed
  ).length;
  const progressPercentage =
    prayerTimes.length > 0 ? (completedPrayers / prayerTimes.length) * 100 : 0;

  // Format date for section title
  const formatDateTitle = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today's Progress";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday's Progress";
    } else {
      return `${date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })} Progress`;
    }
  };

  return (
    <section className="mb-12">
      <div className="rounded-2xl md:p-8 p-4 shadow-sm bg-[#FDD53526] border border-[#FDD535]/70">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-2xl font-semibold mb-4 sm:mb-0">
            {formatDateTitle(selectedDate)}
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
        <p className="text-center font-medium">
          {completedPrayers === 5
            ? "Alhamdulillah! All prayers completed!"
            : `${5 - completedPrayers} more prayer${
                5 - completedPrayers !== 1 ? "s" : ""
              } to complete`}
        </p>
      </div>
    </section>
  );
};

export default TodayProgressSection;
