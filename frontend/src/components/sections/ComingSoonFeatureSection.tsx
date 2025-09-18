import { Compass, RotateCcw } from "lucide-react";

const ComingSoonFeatureSection = () => {
  return (
    <section className="mb-8">
      <h3 className="text-2xl font-semibold !mb-6">
        Coming Soon Features
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="!bg-[#FDD53526] rounded-xl !p-6 shadow-sm !border !border-[#FDD535]/60 hover:shadow-md transition-all duration-200 hover:-translate-y-1 group">
          <div className="flex flex-col items-center text-center gap-4">
            <RotateCcw className="w-8 h-8" />
            <span className="font-medium">
              Dhikr Counter
            </span>
          </div>
        </button>
        <button className="!bg-[#FDD53526] rounded-xl !p-6 shadow-sm !border !border-[#FDD535]/60 hover:shadow-md transition-all duration-200 hover:-translate-y-1 group">
          <div className="flex flex-col items-center text-center gap-4">
            <Compass className="w-8 h-8" />
            <span className="font-medium">
              Qibla Direction
            </span>
          </div>
        </button>
      </div>
    </section>
  );
};

export default ComingSoonFeatureSection;
