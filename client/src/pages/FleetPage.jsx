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
      {/* Header */}
      <div className="bg-slate-900 border-b border-white/10 py-8">
        <div className="container-app">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Our <span className="gradient-text">Fleet</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Browse all available vehicles · {vehicles.length} vehicles found
          </p>
        </div>
      </div>

      <div className="container-app py-6">
        {/* Mobile filter toggle */}
        <button
          className="lg:hidden btn-secondary !py-2 !text-sm mb-4 w-full justify-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiFilter size={14} /> {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`lg:w-56 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="glass-card p-4 lg:sticky lg:top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                  <FiFilter className="text-amber-500" size={14} /> Filters
                </h3>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <FiX size={10} /> Clear
                  </button>
                )}
              </div>

              {/* Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <FiSearch
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={13}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field !pl-9 !py-2 !text-sm"
                  />
                </div>
              </form>

              {/* Category */}
              <div className="mb-4">
                <h4 className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wider">
                  Category
                </h4>
                <div className="space-y-0.5 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setSearchParams({});
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${!selectedCategory
                      ? "bg-amber-500/20 text-amber-500"
                      : "text-slate-400 hover:text-white hover:bg-white/10"
                      }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => {
                        setSelectedCategory(cat._id);
                        setSearchParams({ category: cat._id });
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${selectedCategory === cat._id
                        ? "bg-amber-500/20 text-amber-500"
                        : "text-slate-400 hover:text-white hover:bg-white/10"
                        }`}
                    >
                      <span>{cat._id}</span>
                      <span className="text-slate-400">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Transmission */}
              <div className="mb-4">
                <h4 className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wider">
                  Transmission
                </h4>
                <div className="space-y-0.5">
                  {["", "Manual", "Automatic"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTransmission(t)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${selectedTransmission === t
                        ? "bg-amber-500/20 text-amber-500"
                        : "text-slate-400 hover:text-white hover:bg-white/10"
                        }`}
                    >
                      {t || "All"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div>
                <h4 className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wider">
                  Fuel Type
                </h4>
                <div className="space-y-0.5">
                  {["", "Petrol", "Diesel", "Hybrid", "Electric"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFuelType(f)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${selectedFuelType === f
                        ? "bg-amber-500/20 text-amber-500"
                        : "text-slate-400 hover:text-white hover:bg-white/10"
                        }`}
                    >
                      {f || "All"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Vehicle Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="shimmer h-72 rounded-2xl" />
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              <div className="glass-card p-10 text-center">
                <FaCar className="text-3xl text-slate-400 mx-auto mb-3" />
                <h3 className="text-white text-base font-semibold mb-1">
                  No vehicles found
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Try adjusting your filters.
                </p>
                <button onClick={clearFilters} className="btn-primary !text-sm">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                  <VehicleCard key={v._id} vehicle={v} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetPage;
