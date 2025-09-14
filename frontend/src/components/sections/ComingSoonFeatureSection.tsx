import { Compass, RotateCcw } from "lucide-react";

const ComingSoonFeatureSection = () => {
  return (
    <section>
      <h3 className="text-2xl font-semibold text-gray-900 !mb-6">
        Coming Soon Features
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="!bg-white rounded-xl !p-6 shadow-sm border border-gray-200 hover:bg-gray-50 hover:border-indigo-300 hover:shadow-md transition-all duration-200 hover:-translate-y-1 group">
          <div className="flex flex-col items-center text-center gap-3">
            <RotateCcw className="w-8 h-8 text-gray-600 group-hover:text-indigo-600 transition-colors" />
            <span className="font-medium text-gray-700 group-hover:text-indigo-700">
              Dhikr Counter
            </span>
          </div>
        </button>
        <button className="!bg-white rounded-xl !p-6 shadow-sm border border-gray-200 hover:bg-gray-50 hover:border-indigo-300 hover:shadow-md transition-all duration-200 hover:-translate-y-1 group">
          <div className="flex flex-col items-center text-center gap-3">
            <Compass className="w-8 h-8 text-gray-600 group-hover:text-indigo-600 transition-colors" />
            <span className="font-medium text-gray-700 group-hover:text-indigo-700">
              Qibla Direction
            </span>
          </div>
        </button>
      </div>
    </section>
  );
};

export default ComingSoonFeatureSection;
