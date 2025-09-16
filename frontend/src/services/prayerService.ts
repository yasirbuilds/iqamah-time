import Cookies from "js-cookie";

const API_BASE_URL = "https://iqamah-time-production.up.railway.app";

export interface Prayer {
  id: string;
  prayerName: string;
  prayerType: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrayersResponse {
  prayers: Prayer[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

export interface StatsResponse {
  stats: { [key: string]: number };
}

export const fetchPrayers = async (
  page: number = 1
): Promise<PrayersResponse> => {
  const token = Cookies.get("token");
  const response = await fetch(
    `${API_BASE_URL}/prayers?page=${page}&limit=20`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch prayers");
  return response.json();
};

export const fetchAllPrayers = async (): Promise<PrayersResponse> => {
  const token = Cookies.get("token");
  const response = await fetch(`${API_BASE_URL}/prayers?page=1&limit=100`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch all prayers");
  return response.json();
};

export const fetchStats = async (): Promise<StatsResponse> => {
  const token = Cookies.get("token");
  const response = await fetch(`${API_BASE_URL}/prayers/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch stats");
  return response.json();
};
