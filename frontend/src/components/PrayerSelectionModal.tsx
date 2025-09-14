import React from "react";
import { X, Users, User, Clock, XCircle } from "lucide-react";

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
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100",
    borderColor: "border-green-200",
    description: "Prayed with congregation",
  },
  {
    value: "ALONE",
    label: "Alone",
    icon: User,
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
    borderColor: "border-blue-200",
    description: "Prayed individually",
  },
  {
    value: "QAZAH",
    label: "Qazah",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50 hover:bg-orange-100",
    borderColor: "border-orange-200",
    description: "Made up missed prayer",
  },
  {
    value: "MISSED",
    label: "Missed",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50 hover:bg-red-100",
    borderColor: "border-red-200",
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {prayerName} Prayer Status
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-3">
          {PRAYER_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = currentStatus === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => onStatusSelect(option.value)}
                disabled={loading}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                  isSelected
                    ? `${option.bgColor} ${option.borderColor}`
                    : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div
                  className={`p-2 rounded-full ${
                    isSelected ? "bg-white" : option.bgColor
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isSelected ? option.color : "text-gray-600"
                    }`}
                  />
                </div>
                <div className="text-left flex-1">
                  <div
                    className={`font-medium ${
                      isSelected ? option.color : "text-gray-900"
                    }`}
                  >
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {option.description}
                  </div>
                </div>
                {isSelected && (
                  <div className={`w-2 h-2 rounded-full bg-current ${option.color}`} />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrayerSelectionModal;
