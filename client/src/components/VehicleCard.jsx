import { useState } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiSettings, FiZap, FiArrowRight } from "react-icons/fi";
import { FaCar } from "react-icons/fa";

const VehicleCard = ({ vehicle }) => {
  const [imgError, setImgError] = useState(false);

  const colorMap = {
    Alto: "from-blue-600 to-blue-900",
    WagonR: "from-purple-600 to-purple-900",
    Every: "from-cyan-600 to-cyan-900",
    Buddy: "from-orange-600 to-orange-900",
    Premio: "from-teal-600 to-teal-900",
    Axio: "from-indigo-600 to-indigo-900",
    Aqua: "from-emerald-600 to-emerald-900",
    Prius: "from-fuchsia-600 to-fuchsia-900",
    Van: "from-amber-600 to-amber-900",
    SUV: "from-rose-600 to-rose-900",
    Other: "from-slate-600 to-slate-900",
  };

  const bgGradient = colorMap[vehicle.category] || colorMap.Other;
  const hasImage =
    vehicle.images &&
    vehicle.images.length > 0 &&
    !vehicle.images[0].includes("/vehicles/");
  const imgSrc = hasImage
    ? vehicle.images[0].startsWith("/")
      ? vehicle.images[0]
      : `/${vehicle.images[0]}`
    : null;

  return (
    <Link to={`/vehicle/${vehicle._id}`} className="block group h-full">
      <div className="glass-card h-full flex flex-col group-hover:-translate-y-1 group-hover:shadow-lg transition-all duration-300">
        {/* Image */}
        <div className="relative w-full h-44 sm:h-48 overflow-hidden flex-shrink-0 bg-white/10">
          {imgSrc && !imgError ? (
            <img
              src={imgSrc}
              alt={vehicle.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${bgGradient} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}
            >
              <FaCar className="text-white/30 text-6xl" />
            </div>
          )}
          <div className="absolute top-3 right-3 text-white">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900/40 backdrop-blur-md shadow-sm border border-white/20">
              {vehicle.category}
            </span>
          </div>
          {!vehicle.available && (
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-sm">
              <span className="px-3 py-1.5 bg-red-500/90 text-white rounded-lg font-semibold text-xs border border-red-400">
                Not Available
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 min-w-0">
          <h3 className="text-white font-bold text-base mb-3 group-hover:text-amber-500 transition-colors line-clamp-1 truncate">
            {vehicle.name}
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-slate-400 text-[11px] sm:text-xs mb-4 font-medium">
            <span className="flex items-center gap-1.5 bg-white/10 py-1.5 px-2 rounded-lg border border-white/10">
              <FiUsers size={12} className="text-slate-400" /> {vehicle.seats}{" "}
              Select
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 py-1.5 px-2 rounded-lg border border-white/10">
              <FiSettings size={12} className="text-slate-400" />{" "}
              {vehicle.transmission === "Automatic" ? "Auto" : "Manual"}
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 py-1.5 px-2 rounded-lg border border-white/10">
              <FiZap size={12} className="text-slate-400" /> {vehicle.fuelType}
            </span>
          </div>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
            <div>
              <span className="text-lg sm:text-xl font-bold text-white">
                Rs. {vehicle.pricePerDay?.toLocaleString()}
              </span>
              <span className="text-slate-400 text-xs ml-1 font-medium">
                / day
              </span>
            </div>
            <span className="text-xs text-amber-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 tracking-wide">
              Book Now <FiArrowRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;
