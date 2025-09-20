import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateScrollPickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  initialDaysToShow?: number; // Initial number of days to load
}

const DateScrollPicker: React.FC<DateScrollPickerProps> = ({
  selectedDate,
  onDateSelect,
  initialDaysToShow = 60, // Show 60 days initially
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [dates, setDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitiallyScrolled, setHasInitiallyScrolled] = useState(false);
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  // Generate initial array of dates
  const generateInitialDates = useCallback(() => {
    const dateArray: Date[] = [];
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - initialDaysToShow);

    // Only generate dates up to today (no future dates)
    for (let i = 0; i <= initialDaysToShow; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dateArray.push(date);
    }

    return dateArray;
  }, [initialDaysToShow, today]);

  // Load more dates when scrolling to the left (past dates)
  const loadMorePastDates = useCallback(() => {
    if (isLoading || dates.length === 0) return;

    setIsLoading(true);
    setTimeout(() => {
      const oldestDate = dates[0];
      const newDates: Date[] = [];

      // Add 30 more days going backwards
      for (let i = 60; i >= 1; i--) {
        const date = new Date(oldestDate);
        date.setDate(oldestDate.getDate() - i);
        newDates.push(date);
      }

      setDates((prev) => [...newDates, ...prev]);
      setIsLoading(false);
    }, 100); // Small delay to prevent too frequent calls
  }, [dates, isLoading]);

  // Initialize dates
  useEffect(() => {
    const initialDates = generateInitialDates();
    setDates(initialDates);
  }, [generateInitialDates]);

  // Handle scroll events for infinite loading
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft } = container;

      // If scrolled close to the left edge (past dates), load more
      if (scrollLeft < 200 && !isLoading) {
        const currentScrollLeft = scrollLeft;
        loadMorePastDates();

        // After loading, maintain scroll position
        setTimeout(() => {
          if (container) {
            container.scrollLeft = currentScrollLeft + 30 * 73; // 30 new dates * approximate width
          }
        }, 150);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loadMorePastDates, isLoading]);

  // Scroll to today on initial load ONLY
  useEffect(() => {
    if (
      scrollContainerRef.current &&
      dates.length > 0 &&
      !isLoading &&
      !hasInitiallyScrolled
    ) {
      const todayIndex = dates.findIndex(
        (date) => date.toDateString() === today.toDateString()
      );

      if (todayIndex !== -1) {
        const dateElement = scrollContainerRef.current.children[
          todayIndex
        ] as HTMLElement;
        if (dateElement) {
          // Use instant scroll (no animation) for initial positioning
          scrollContainerRef.current.scrollTo({
            left:
              dateElement.offsetLeft -
              scrollContainerRef.current.offsetWidth / 2 +
              dateElement.offsetWidth / 2,
            behavior: "instant" as ScrollBehavior,
          });
          setHasInitiallyScrolled(true); // Mark as initially scrolled

          // If no date is selected or selected date is not today, select today
          if (
            !selectedDate ||
            selectedDate.toDateString() !== today.toDateString()
          ) {
            onDateSelect(today);
          }
        }
      }
    }
  }, [
    dates,
    isLoading,
    hasInitiallyScrolled,
    selectedDate,
    today,
    onDateSelect,
  ]);

  const formatDate = (date: Date) => {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return { label: "Today", date: date.getDate() };
    } else if (date.toDateString() === yesterday.toDateString()) {
      return { label: "Yesterday", date: date.getDate() };
    } else {
      return {
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        date: date.getDate(),
      };
    }
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short" });
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Touch and drag support
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftStart(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply for faster scrolling
    scrollContainerRef.current.scrollLeft = scrollLeftStart - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftStart(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeftStart - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative mb-6">
      {/* Loading indicator for past dates */}
      {isLoading && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FDD535]"></div>
        </div>
      )}

      {/* Scroll buttons */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full p-2 transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full p-2 transition-all duration-200"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Date scroll container */}
      <div
        ref={scrollContainerRef}
        className={`flex gap-3 overflow-x-auto scrollbar-hide px-8 py-2 ${
          isDragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
        }}
      >
        {isLoading && dates.length > 0 && (
          <div className="flex items-center justify-center min-w-[50px]">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FDD535]"></div>
          </div>
        )}
        {dates.map((date, index) => {
          const { label, date: dayNumber } = formatDate(date);
          const selected = isSelected(date);

          return (
            <button
              key={`${date.getTime()}-${index}`} // Use timestamp + index for unique keys
              onClick={() => !isDragging && onDateSelect(date)}
              className={`flex flex-col items-center justify-center min-w-[50px] transition-all duration-200 hover:scale-105 ${
                selected ? "scale-105" : ""
              }`}
              style={{ userSelect: "none" }} // Prevent text selection during drag
            >
              <span
                className={`text-xs font-medium ${
                  selected ? "text-white" : "text-white/70"
                }`}
              >
                {label}
              </span>
              <span
                className={`text-lg font-bold ${
                  selected ? "text-white" : "text-white/70"
                }`}
              >
                {dayNumber}
              </span>
              <span
                className={`text-xs ${
                  selected ? "text-white" : "text-white/70"
                }`}
              >
                {formatMonth(date)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateScrollPicker;
