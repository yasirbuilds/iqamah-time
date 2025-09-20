import { Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useEmblaCarousel from "embla-carousel-react";
import { useAuth } from "../../contexts/AuthContext";
import { fetchAllPrayers, fetchPrayers } from "../../services/prayerService";
import { ALL_PRAYERS, PRAYER_DISPLAY_NAMES } from "../../utils";
import type { PrayerAPI } from "../../types";

const PrayerHistorySection = () => {
  const { user } = useAuth();
  const [prayers, setPrayers] = useState<PrayerAPI[]>([]);
  const [allPrayers, setAllPrayers] = useState<PrayerAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "end",
    containScroll: "trimSnaps",
    slidesToScroll: 1,
    direction: "ltr",
  });

  const prayerOrder = ALL_PRAYERS;

  const loadPrayers = async (page: number = 1) => {
    try {
      setLoading(true);
      const data = await fetchPrayers(page);
      setPrayers(data.prayers as unknown as PrayerAPI[]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load prayer history");
    } finally {
      setLoading(false);
    }
  };

  const loadAllPrayers = async () => {
    try {
      const data = await fetchAllPrayers();
      setAllPrayers(data.prayers as unknown as PrayerAPI[]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadPrayers();
    loadAllPrayers();
  }, []);

  // Scroll to the end (latest dates) when carousel is ready and data is loaded
  useEffect(() => {
    if (emblaApi && allPrayers.length > 0) {
      emblaApi.scrollTo(emblaApi.slideNodes().length - 1);
    }
  }, [emblaApi, allPrayers]);

  const groupPrayersByDate = () => {
    const grouped: { [date: string]: { [prayer: string]: PrayerAPI } } = {};

    allPrayers.forEach((prayer) => {
      const date = prayer.date.split("T")[0];
      if (!grouped[date]) {
        grouped[date] = {};
      }
      grouped[date][prayer.prayerName] = prayer;
    });

    return grouped;
  };

  // New function to generate all dates in the range (from min to max date in allPrayers)
  const getDateRange = () => {
    if (allPrayers.length === 0) return [];
    const dates = allPrayers.map((p) => new Date(p.date.split("T")[0]));
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
    const range: string[] = [];
    const current = new Date(minDate);
    while (current <= maxDate) {
      range.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return range;
  };

  const groupedPrayers = groupPrayersByDate();
  const dateRange = getDateRange();

  const getPrayerTypeColor = (prayerType: string) => {
    switch (prayerType) {
      case "JAMMAT":
        return "bg-green-400";
      case "ALONE":
        return "bg-blue-400";
      case "QAZAH":
        return "bg-rose-400";
      case "MISSED":
        return "bg-gray-500";
      default:
        return "bg-white";
    }
  };

  return (
    <section className="relative">
      <div className="absolute md:-left-40 -right-56 md:-top-[20px] -top-[50px] md:w-[350px] md:h-[400px] w-[250px] h-[300px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,_#CCAC2A,_#FDD535)] md:blur-[130px] blur-[110px] z-0" />
      <div className="text-center mb-10 relative z-10">
        <h2 className="text-3xl font-bold !mb-2">Prayer History</h2>
        <p className="text-lg">
          Track your spiritual journey, {user?.name?.split(" ")[0]}
        </p>
      </div>
      <div className="rounded-2xl md:p-8 p-4 shadow-sm bg-[#FDD53526] border border-[#FDD535]/60 relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 z-20" />
          <h3 className="text-2xl font-semibold z-20">Recent Prayers</h3>
        </div>

        {loading ? (
          <div className="mt-8 overflow-hidden">
            <div className="flex items-start gap-4">
              {/* Skeleton */}
              <div className="overflow-hidden flex-1 mt-1" ref={emblaRef}>
                <div className="flex md:gap-3 gap-2">
                  {[...Array(9)].map((_, index) => (
                    <div key={index} className="flex-shrink-0">
                      <div className="text-xs text-center mb-2">
                        <div className="w-6 h-3 bg-gray-200 rounded mx-auto animate-pulse" />
                      </div>
                      <div className="flex flex-col md:gap-3 gap-2">
                        {prayerOrder.map((prayerName) => (
                          <div
                            key={prayerName}
                            className="md:w-8 md:h-8 w-6 h-6 rounded-md bg-gray-200 animate-pulse"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right-side prayer labels skeleton */}
              <div className="flex flex-col md:gap-3 gap-2 mt-6 flex-shrink-0">
                {prayerOrder.map((prayer) => (
                  <div
                    key={prayer}
                    className="text-xs text-center md:w-8 md:h-8 w-6 h-6 flex items-center justify-center font-medium"
                  >
                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Legend skeleton */}
            <div className="flex justify-between md:justify-center md:gap-6 gap-4 mt-8 md:text-xs text-[10px]">
              <div className="flex items-center gap-1">
                <div className="md:w-3 md:h-3 h-2 w-2 bg-gray-200 rounded-sm animate-pulse" />
                <span className="md:w-16 w-10 md:h-3 h-2 bg-gray-200 rounded animate-pulse block" />
              </div>
              <div className="flex items-center gap-1">
                <div className="md:w-3 md:h-3 h-2 w-2 bg-gray-200 rounded-sm animate-pulse" />
                <span className="md:w-16 w-10 md:h-3 h-2 bg-gray-200 rounded animate-pulse block" />
              </div>
              <div className="flex items-center gap-1">
                <div className="md:w-3 md:h-3 h-2 w-2 bg-gray-200 rounded-sm animate-pulse" />
                <span className="md:w-16 w-10 md:h-3 h-2 bg-gray-200 rounded animate-pulse block" />
              </div>
              <div className="flex items-center gap-1">
                <div className="md:w-3 md:h-3 h-2 w-2 bg-gray-200 rounded-sm animate-pulse" />
                <span className="md:w-16 w-10 md:h-3 h-2 bg-gray-200 rounded animate-pulse block" />
              </div>
              <div className="flex items-center gap-1">
                <div className="md:w-3 md:h-3 h-2 w-2 bg-gray-200 rounded-sm animate-pulse" />
                <span className="md:w-16 w-10 md:h-3 h-2 bg-gray-200 rounded animate-pulse block" />
              </div>
            </div>
          </div>
        ) : prayers.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">
              No Prayer Records Found
            </h4>
            <p className="">
              Start tracking your prayers to see your spiritual journey here.
            </p>
          </div>
        ) : (
          <div className="mt-8">
            <div className="flex items-start gap-4">
              <div className="overflow-hidden flex-1" ref={emblaRef}>
                <div className="flex md:gap-3 gap-2">
                  {loading
                    ? [...Array(10)].map((_, index) => (
                        <div key={index} className="flex-shrink-0">
                          <div className="flex flex-col gap-1 mb-2">
                            {prayerOrder.map((prayerIndex) => (
                              <div
                                key={prayerIndex}
                                className="md:w-8 md:h-8 w-6 h-6 rounded-md bg-gray-200 animate-pulse"
                              />
                            ))}
                          </div>
                          <div className="text-xs text-center w-8 h-4 bg-gray-200 rounded animate-pulse" />
                        </div>
                      ))
                    : dateRange.map((date) => {
                        const dayPrayers = groupedPrayers[date] || {};
                        return (
                          <div key={date} className="flex-shrink-0">
                            <div className="text-xs text-center mb-2">
                              {new Date(date).getDate()}
                            </div>
                            <div className="flex flex-col md:gap-3 gap-2 mt-">
                              {prayerOrder.map((prayerName) => {
                                const prayer = dayPrayers[prayerName];
                                return (
                                  <div
                                    key={prayerName}
                                    className={`md:w-8 md:h-8 w-6 h-6 rounded-md ${
                                      prayer
                                        ? getPrayerTypeColor(prayer.prayerType)
                                        : "bg-white"
                                    }`}
                                    title={
                                      prayer
                                        ? `${prayerName} - ${
                                            PRAYER_DISPLAY_NAMES[
                                              prayer.prayerType as keyof typeof PRAYER_DISPLAY_NAMES
                                            ]
                                          }`
                                        : `${prayerName} - Not recorded`
                                    }
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                </div>
              </div>

              <div className="flex flex-col md:gap-3 gap-2 mt-6 flex-shrink-0">
                {prayerOrder.map((prayer) => (
                  <div
                    key={prayer}
                    className="text-xs text-center md:w-8 md:h-8 w-6 h-6 flex items-center justify-center font-medium"
                  >
                    {prayer.slice(0, 3)}
                  </div>
                ))}
              </div>
            </div>{" "}
            <div className="flex justify-between md:justify-center md:gap-6 gap-4 mt-8 md:text-xs text-[10px]">
              <div className="flex items-center gap-1">
                <div className="md:w-3 md:h-3 h-2 w-2 bg-[#6ff776] rounded-sm" />
                <span>Jamaat</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="md:w-3 md:h-3 h-2 w-2 bg-[#f7ba5e] rounded-sm" />
                <span>Alone</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="md:w-3 md:h-3 h-2 w-2 bg-[#f7665c] rounded-sm" />
                <span>Qazah</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="md:w-3 md:h-3 h-2 w-2 bg-[#cdc6c6] rounded-sm" />
                <span>Missed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="md:w-3 md:h-3 h-2 w-2 bg-white rounded-sm" />
                <span>No record</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PrayerHistorySection;
