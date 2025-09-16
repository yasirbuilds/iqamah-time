import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchStats } from "../../services/prayerService";

const PRAYER_TYPE_LABELS = {
  JAMMAT: "Jamaat",
  ALONE: "Alone",
  QAZAH: "Qazah",
  MISSED: "Missed",
};

const StatisticSection = () => {
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState<{ [key: string]: number }>({});

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const data = await fetchStats();
      setStats(data.stats);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load prayer statistics");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const getTotalPrayers = () => {
    return Object.values(stats).reduce((sum, count) => sum + count, 0);
  };

  return (
    <section className="mt-10 mb-20 md:mb-0">
      <div className="rounded-2xl md:p-8 p-4 shadow-sm border border-[#FDD535]/60">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6" />
          <h3 className="text-2xl font-semibold">Prayer Statistics</h3>
        </div>

        {statsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="text-center p-4 bg-gray-50 rounded-xl animate-pulse"
              >
                <div className="w-8 h-8 bg-gray-200 rounded mb-2 mx-auto"></div>
                <div className="w-16 h-4 bg-gray-200 rounded mb-1 mx-auto"></div>
                <div className="w-12 h-3 bg-gray-200 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="bg-[#FDD53526] rounded-2xl p-3 flex justify-center items-center md:hidden mb-4">
              <div className="bg-[#463b0f]/90 border border-[#FDD535] rounded-2xl p-4 text-center flex justify-center flex-col items-center w-full">
                <div className="md:py-6 py-3">
                  <div className="text-3xl font-bold mb-1">
                    {getTotalPrayers()}
                  </div>
                  <div className="text-sm font-medium">Total Prayers</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 md:gap-6 gap-4">
              <div className="bg-[#FDD53526] rounded-2xl p-3 md:flex justify-center items-center hidden">
                <div className="bg-[#463b0f]/90 border border-[#FDD535] rounded-2xl p-4 text-center flex justify-center flex-col items-center w-full">
                  <div className="md:py-6 py-3">
                    <div className="text-3xl font-bold mb-1">
                      {getTotalPrayers()}
                    </div>
                    <div className="text-sm font-medium">Total Prayers</div>
                  </div>
                </div>
              </div>
              {Object.entries(PRAYER_TYPE_LABELS).map(([type, label]) => (
                <div
                  key={type}
                  className="bg-[#FDD53526] rounded-2xl p-3 flex justify-center items-center"
                >
                  <div className="bg-[#463b0f]/90 border border-[#FDD535] rounded-2xl p-4 text-center flex justify-center flex-col items-center w-full">
                    <div className="md:py-6 py-3">
                      <div className="text-2xl font-bold mb-1">
                        {stats[type] || 0}
                      </div>
                      <div className="text-sm font-medium">{label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default StatisticSection;
