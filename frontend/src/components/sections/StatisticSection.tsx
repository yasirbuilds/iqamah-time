import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { showErrorToast } from "../../utils/toastHelpers";
import { fetchStats } from "../../services/prayerService";
import Skeleton from "../Skeleton";

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
      showErrorToast("Failed to load prayer statistics", error);
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
                className="text-center p-4 bg-[#FDD53526] border border-[#FDD535]/30 rounded-xl"
              >
                <Skeleton variant="circle" className="w-8 h-8 mx-auto mb-2" width="2rem" height="2rem" />
                <Skeleton variant="text" className="w-16 h-4 mx-auto mb-1" width="4rem" height="1rem" />
                <Skeleton variant="text" className="w-12 h-3 mx-auto" width="3rem" height="0.75rem" />
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
