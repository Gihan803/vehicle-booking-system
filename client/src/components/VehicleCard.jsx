import { useState } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiSettings, FiZap, FiChevronRight } from "react-icons/fi";
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
      <div className="bg-slate-800/80 border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col group-hover:shadow-xl group-hover:shadow-black/30 group-hover:-translate-y-0.5 transition-all duration-300">

        {/* Image */}
        <div className="relative w-full h-48 overflow-hidden flex-shrink-0 bg-slate-900 rounded-t-2xl">
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
              <FaCar className="text-white/30 text-5xl" />
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/15 backdrop-blur-sm text-white border border-white/20">
              {vehicle.category}
            </span>
          </div>

          {/* Not available overlay */}
          {!vehicle.available && (
            <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center backdrop-blur-sm">
              <span className="px-4 py-1.5 bg-red-500/90 text-white rounded-lg font-semibold text-xs border border-red-400">
                Not Available
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 gap-3">

          {/* Title */}
          <h3 className="text-white font-bold text-base leading-snug line-clamp-1">
            {vehicle.name}
          </h3>

          {/* Specs */}
          <div className="flex items-center gap-4 text-slate-400 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <FiUsers size={13} />
              {vehicle.seats} Seats
            </span>
            <span className="flex items-center gap-1.5">
              <FiSettings size={13} />
              {vehicle.transmission === "Automatic" ? "Auto" : "Manual"}
            </span>
            <span className="flex items-center gap-1.5">
              <FiZap size={13} />
              {vehicle.fuelType}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-white/8 mt-auto" />

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-blue-600 font-bold text-lg">
                Rs. {vehicle.pricePerDay?.toLocaleString()}
              </span>
              <span className="text-slate-500 text-xs">/ day</span>
            </div>
            <span className="text-blue-600 font-semibold text-sm flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
              View Details <FiChevronRight size={15} />
            </span>
          </div>

        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;
