import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getVehicles, getCategories } from "../services/api";
import VehicleCard from "../components/VehicleCard";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import { FaCar } from "react-icons/fa";

const FleetPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedFuelType, setSelectedFuelType] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedTransmission, selectedFuelType]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (selectedTransmission) params.transmission = selectedTransmission;
      if (selectedFuelType) params.fuelType = selectedFuelType;
      if (search) params.search = search;

      const [vehiclesRes, categoriesRes] = await Promise.all([
        getVehicles(params),
        getCategories(),
      ]);
      setVehicles(vehiclesRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error("Failed to load vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVehicles();
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedTransmission("");
    setSelectedFuelType("");
    setSearch("");
    setSearchParams({});
  };

  const hasFilters =
    selectedCategory || selectedTransmission || selectedFuelType || search;

  return (
    <div className="min-h-screen">
      {/* Mobile filter toggle */}
      <div className="md:hidden p-4 bg-slate-900 border-b border-white/10">
        <div className="container-app">
          <button
            className="btn-secondary w-full justify-center !py-2 !text-sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter size={14} /> {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      <div className="container-app flex flex-col md:flex-row items-stretch">
        {/* Left Sidebar */}
        <aside
          className={`w-full md:w-56 lg:w-64 flex-shrink-0 bg-[#161a22] p-5 md:p-6 md:py-8 border-x border-white/5 ${showFilters ? "block" : "hidden md:block"
            }`}
        >
          <div className="md:sticky md:top-24">

            {/* VEHICLE TYPE */}
            <div className="mb-8">
              <h4 className="text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-4">
                Vehicle Type
              </h4>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={!selectedCategory}
                    onChange={() => {
                      setSelectedCategory("");
                      setSearchParams({});
                    }}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-white/20 focus:ring-offset-0 focus:ring-0 cursor-pointer"
                  />
                  <span className={`text-sm font-medium transition-colors ${!selectedCategory ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`}>
                    All Types
                  </span>
                </label>
                {categories.slice(0, 5).map((cat) => (
                  <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategory === cat._id}
                      onChange={() => {
                        setSelectedCategory(cat._id);
                        setSearchParams({ category: cat._id });
                      }}
                      className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-white/20 focus:ring-offset-0 focus:ring-0 cursor-pointer"
                    />
                    <span className={`text-sm font-medium transition-colors ${selectedCategory === cat._id ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`}>
                      {cat._id}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* FUEL & TRANSMISSION */}
            <div className="mb-8">
              <h4 className="text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-4">
                Fuel & Transmission
              </h4>
              <div className="space-y-4">
                {["Hybrid", "Petrol"].map((f) => (
                  <label key={f} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="fuel"
                      checked={selectedFuelType === f}
                      onChange={() => setSelectedFuelType(f)}
                      onClick={() => {
                        // Allow deselecting radio
                        if (selectedFuelType === f) setSelectedFuelType("");
                      }}
                      className="w-4 h-4 text-amber-500 bg-slate-800 border-white/20 focus:ring-offset-0 focus:ring-0 cursor-pointer"
                    />
                    <span className={`text-sm font-medium transition-colors ${selectedFuelType === f ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`}>
                      {f}
                    </span>
                  </label>
                ))}

                <div className="mt-4 pt-4 border-t border-white/5">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedTransmission === "Automatic"}
                      onChange={() =>
                        setSelectedTransmission(
                          selectedTransmission === "Automatic" ? "" : "Automatic",
                        )
                      }
                      className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-white/20 focus:ring-offset-0 focus:ring-0 cursor-pointer"
                    />
                    <span className={`text-sm font-medium transition-colors ${selectedTransmission === "Automatic" ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`}>
                      Automatic
                    </span>
                  </label>
                </div>
              </div>
            </div>


            {/* Search block in sidebar */}
            <div className="pt-5 border-t border-white/5">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg pl-9 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
              </form>
            </div>

          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-6 md:py-8 pl-0 md:pl-6 lg:pl-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl sm:text-[32px] font-extrabold text-white mb-2 tracking-tight">
                Vehicle Fleet
              </h1>
              <p className="text-slate-400 text-sm font-medium">
                Showing {vehicles.length} available vehicles in your inventory
              </p>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="shimmer h-[340px] rounded-2xl" />
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-12 text-center mt-4">
                <FaCar className="text-4xl text-slate-500 mx-auto mb-4" />
                <h3 className="text-white text-lg font-bold mb-2">
                  No vehicles found
                </h3>
                <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
                  No vehicles matched your current filter criteria. Try expanding your search or clearing filters.
                </p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                {vehicles.map((v) => (
                  <VehicleCard key={v._id} vehicle={v} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FleetPage;
