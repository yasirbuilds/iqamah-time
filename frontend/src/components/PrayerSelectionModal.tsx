import React, { useEffect, useState } from "react";
import { X, Users, User, Clock, XCircle, CheckCircle } from "lucide-react";

interface PrayerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayerName: string;
  currentStatus: string | null;
  onStatusSelect: (status: string) => void;
  loading: boolean;
}

const PRAYER_OPTIONS = [
  {
    value: "JAMMAT",
    label: "Jamaat",
    icon: Users,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-400/70",
    hoverColor: "hover:bg-green-500/30",
    description: "Prayed with congregation",
  },
  {
    value: "ALONE",
    label: "Alone",
    icon: User,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-400/70",
    hoverColor: "hover:bg-blue-500/30",
    description: "Prayed individually",
  },
  {
    value: "QAZAH",
    label: "Qazah",
    icon: Clock,
    color: "text-rose-400",
    bgColor: "bg-rose-500/20",
    borderColor: "border-rose-400/70",
    hoverColor: "hover:bg-rose-500/30",
    description: "Made up missed prayer",
  },
  {
    value: "MISSED",
    label: "Missed",
    icon: XCircle,
    color: "text-gray-400",
    bgColor: "bg-gray-500/20",
    borderColor: "border-gray-400/70",
    hoverColor: "hover:bg-gray-500/30",
    description: "Did not pray",
  },
];

const PrayerSelectionModal: React.FC<PrayerSelectionModalProps> = ({
  isOpen,
  onClose,
  prayerName,
  currentStatus,
  onStatusSelect,
  loading,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready before animating
      setTimeout(() => setIsAnimating(true), 50);
    } else {
      setIsAnimating(false);
      // Keep component rendered during exit animation
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const handleStatusSelect = (status: string) => {
    if (!loading) {
      onStatusSelect(status);
    }
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleOverlayClick}
      />

      {/* Desktop Modal (md and up) */}
      <div className="hidden md:block">
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-6 transition-all duration-300 ${
            isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="bg-black/90 backdrop-blur-lg border border-[#FDD535]/70 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex gap-10 items-center justify-between px-6 py-4 border-b border-[#FDD535]/30">
              <h3 className="text-xl font-semibold text-white">
                How did you completed your {prayerName} Prayer
              </h3>
              <button
                onClick={onClose}
                disabled={loading}
                className="p-2 hover:bg-[#FDD535]/20 rounded-full transition-colors text-[#FDD535] disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 !space-y-4 max-h-[60vh] overflow-y-auto">
              {PRAYER_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = currentStatus === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => handleStatusSelect(option.value)}
                    disabled={loading}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${
                      isSelected
                        ? `${option.bgColor} ${option.borderColor} backdrop-blur-lg`
                        : `bg-gray-800/50 border-gray-700/50 ${option.hoverColor} hover:border-gray-600/70 backdrop-blur-sm`
                    } ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-full border transition-all duration-200 ${
                        isSelected
                          ? `${option.bgColor} ${option.borderColor} backdrop-blur-sm`
                          : "bg-[#FDD53526] border-[#FDD535]/60"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 transition-colors duration-200 ${
                          isSelected ? option.color : "text-[#FDD535]/90"
                        }`}
                      />
                    </div>
                    <div className="text-left flex-1">
                      <div
                        className={`font-semibold text-lg transition-colors duration-200 ${
                          isSelected ? option.color : "text-gray-200"
                        }`}
                      >
                        {option.label}
                      </div>
                      <div
                        className={`text-sm transition-colors duration-200 ${
                          isSelected ? option.color : "text-gray-400"
                        }`}
                      >
                        {option.description}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="flex items-center">
                        <CheckCircle
                          className={`w-5 h-5
                          ${isSelected ? option.color : "text-[#FDD535]"}`}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-out ${
          isAnimating ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-black/95 backdrop-blur-lg border-t border-[#FDD535]/70 rounded-t-3xl shadow-2xl">
          {/* Handle indicator */}
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1 bg-[#FDD535]/70 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center gap-10 justify-between px-6 py-4 border-b border-[#FDD535]/30">
            <h3 className="text-xl font-semibold text-white">
              How did you completed your {prayerName} Prayer
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#FDD535]/20 rounded-full transition-colors text-[#FDD535]"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 pb-8 h-[45vh] overflow-y-auto smooth-scroll">
            <div className="!space-y-6">
              {PRAYER_OPTIONS.map((option, index) => {
                const Icon = option.icon;
                const isSelected = currentStatus === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => handleStatusSelect(option.value)}
                    disabled={loading}
                    className={`w-full p-4 rounded-2xl border transition-all duration-200 flex items-center gap-4 mobile-touch-feedback ${
                      isSelected
                        ? `${option.bgColor} ${option.borderColor} backdrop-blur-lg`
                        : `bg-gray-800/30 border-gray-700/50 ${option.hoverColor} hover:border-gray-600/70 backdrop-blur-sm`
                    } ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-[1.02] active:scale-[0.98]"
                    } ${
                      isAnimating
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    }`}
                    style={{
                      transitionDelay: `${index * 50}ms`,
                    }}
                  >
                    <div
                      className={`p-3 rounded-full border transition-all duration-200 ${
                        isSelected
                          ? `${option.bgColor} ${option.borderColor} backdrop-blur-sm`
                          : "bg-[#FDD53526] border-[#FDD535]/60"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 transition-colors duration-200 ${
                          isSelected ? option.color : "text-[#FDD535]/90"
                        }`}
                      />
                    </div>
                    <div className="text-left flex-1">
                      <div
                        className={`font-semibold text-lg transition-colors duration-200 ${
                          isSelected ? option.color : "text-gray-200"
                        }`}
                      >
                        {option.label}
                      </div>
                      <div
                        className={`text-sm transition-colors duration-200 ${
                          isSelected ? option.color : "text-gray-400"
                        }`}
                      >
                        {option.description}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="flex items-center">
                        <CheckCircle
                          className={`w-5 h-5
                          ${isSelected ? option.color : "text-[#FDD535]"}
                          `}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Safe area for iPhone */}
          <div className="pb-safe-bottom" />
        </div>
      </div>
    </>
  );
};

export default PrayerSelectionModal;
