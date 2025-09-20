import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchPrayersByDate = async (dateString: string) => {
  const token = Cookies.get("token");

  const response = await fetch(`${API_BASE_URL}/prayers?date=${dateString}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch prayer times");
  }

  const data = await response.json();
  return data.prayers || [];
};

export const updatePrayer = async (prayerId: string, prayerType: string) => {
  const token = Cookies.get("token");
  const response = await fetch(`${API_BASE_URL}/prayers/${prayerId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prayerType }),
  });
  if (!response.ok) throw new Error("Failed to update prayer");
  return response.json();
};
