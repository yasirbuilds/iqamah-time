import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import moment from "moment-hijri";

const HomeWelcomeSection = () => {
  const { user } = useAuth();
  const [englishDate, setEnglishDate] = useState<string>("");
  const [islamicDate, setIslamicDate] = useState<string>("");

  useEffect(() => {
    // Calculate today's dates
    const today = new Date();
    const englishDateStr = today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setEnglishDate(englishDateStr);

    // Calculate Islamic date using moment-hijri
    try {
      const hijriDate = moment().format("iD iMMMM iYYYY");
      setIslamicDate(hijriDate);
    } catch (error) {
      console.error("Error calculating Islamic date:", error);
      setIslamicDate("Islamic date unavailable");
    }
  }, []);
  return (
    <section className="text-center mb-12">
      <h2 className="text-3xl font-bold !mb-2">
        <span>Assalamu Alaikum, {user?.name?.split(" ")[0]}!</span>
      </h2>
      <p className="text-lg italic !mb-4">
        May Allah bless your day with peace and guidance
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span>{englishDate}</span>
        </div>
        <div className="hidden sm:block">|</div>
        <div className="flex items-center gap-2">
          <span>{islamicDate}</span>
        </div>
      </div>
    </section>
  );
};

export default HomeWelcomeSection;
