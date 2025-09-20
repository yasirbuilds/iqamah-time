export interface Prayer {
  id: string | null;
  name: string;
  time?: string;
  completed: boolean;
  prayerName?: string;
  prayerType?: string | null;
}

export interface PrayerAPI {
  id: string;
  prayerName: string;
  prayerType: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPrayer {
  id: string | null;
  prayerName: string;
  prayerType: string | null;
  date: string;
}
