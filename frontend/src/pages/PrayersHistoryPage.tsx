import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Calendar, TrendingUp, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import Header from "../components/layout/Header";
import MobileBottomNavigation from "../components/layout/MobileBottomNavigation";

interface Prayer {
  id: string;
  prayerName: string;
  prayerType: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface PrayersResponse {
  prayers: Prayer[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

interface StatsResponse {
  stats: {
    [key: string]: number;
  };
}

const PRAYER_DISPLAY_NAMES = {
  FAJR: "Fajr",
  DHUHR: "Dhuhr",
  ASR: "Asr",
  MAGHRIB: "Maghrib",
  ISHA: "Isha",
};

const PRAYER_TYPE_LABELS = {
  JAMMAT: "Jamaat",
  ALONE: "Alone",
  QAZAH: "Qazah",
  MISSED: "Missed",
};

const PRAYER_TYPE_COLORS = {
  JAMMAT: "bg-green-100 text-green-800",
  ALONE: "bg-blue-100 text-blue-800",
  QAZAH: "bg-orange-100 text-orange-800",
  MISSED: "bg-red-100 text-red-800",
};

const PrayersHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [stats, setStats] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPrayers = async (page: number = 1) => {
    try {
      setLoading(true);
      const token = Cookies.get("token");

      const response = await fetch(
        `https://iqamah-time-production.up.railway.app/prayers?page=${page}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data: PrayersResponse = await response.json();
        setPrayers(data.prayers);
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);
      } else {
        throw new Error("Failed to fetch prayers");
      }
    } catch (error) {
      console.error("Error fetching prayers:", error);
      toast.error("Failed to load prayer history");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const token = Cookies.get("token");

      const response = await fetch("https://iqamah-time-production.up.railway.app/prayers/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data: StatsResponse = await response.json();
        setStats(data.stats);
      } else {
        throw new Error("Failed to fetch stats");
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load prayer statistics");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayers();
    fetchStats();
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchPrayers(page);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTotalPrayers = () => {
    return Object.values(stats).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8 pb-20 md:pb-8">
        {/* Header Section */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Prayer History
          </h2>
          <p className="text-lg text-gray-600">
            Track your spiritual journey, {user?.name?.split(" ")[0]}
          </p>
        </section>

        {/* Statistics Section */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
              <h3 className="text-2xl font-semibold text-gray-900">
                Prayer Statistics
              </h3>
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                  <div className="text-3xl font-bold text-indigo-600 mb-1">
                    {getTotalPrayers()}
                  </div>
                  <div className="text-sm font-medium text-indigo-700">
                    Total Prayers
                  </div>
                </div>
                {Object.entries(PRAYER_TYPE_LABELS).map(([type, label]) => (
                  <div
                    key={type}
                    className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {stats[type] || 0}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Prayer History Section */}
        <section>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-indigo-600" />
              <h3 className="text-2xl font-semibold text-gray-900">
                Recent Prayers
              </h3>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(10)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl animate-pulse"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="w-20 h-4 bg-gray-200 rounded mb-1"></div>
                        <div className="w-32 h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                  </div>
                ))}
              </div>
            ) : prayers.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  No Prayer Records Found
                </h4>
                <p className="text-gray-600">
                  Start tracking your prayers to see your spiritual journey here.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {prayers.map((prayer) => (
                    <div
                      key={prayer.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-lg font-bold text-gray-700">
                            {prayer.prayerName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {
                              PRAYER_DISPLAY_NAMES[
                                prayer.prayerName as keyof typeof PRAYER_DISPLAY_NAMES
                              ]
                            }
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(prayer.date)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          PRAYER_TYPE_COLORS[
                            prayer.prayerType as keyof typeof PRAYER_TYPE_COLORS
                          ]
                        }`}
                      >
                        {
                          PRAYER_TYPE_LABELS[
                            prayer.prayerType as keyof typeof PRAYER_TYPE_LABELS
                          ]
                        }
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Showing {(currentPage - 1) * 20 + 1} to{" "}
                      {Math.min(currentPage * 20, totalCount)} of {totalCount}{" "}
                      entries
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation />
    </div>
  );
};

export default PrayersHistoryPage;
