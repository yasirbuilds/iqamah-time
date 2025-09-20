export const getPrayerStatusLabel = (prayerType: string | null) => {
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
