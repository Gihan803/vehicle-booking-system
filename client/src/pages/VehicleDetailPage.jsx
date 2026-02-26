import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getVehicle, getVehicles } from '../services/api';
import { useAuth } from '../context/AuthContext';
import VehicleCard from '../components/VehicleCard';
import { FiUsers, FiSettings, FiCalendar, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { FaCar, FaGasPump } from 'react-icons/fa';

const VehicleDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [vehicle, setVehicle] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        fetchVehicle();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchVehicle = async () => {
        setLoading(true);
        try {
            const { data } = await getVehicle(id);
            setVehicle(data);
            const relatedRes = await getVehicles({ category: data.category });
            setRelated(relatedRes.data.filter((v) => v._id !== id).slice(0, 3));
        } catch (err) {
            console.error('Failed to load vehicle:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = () => {
        if (!user) {
            navigate('/login', { state: { from: `/vehicle/${id}` } });
        } else {
            navigate(`/booking/${id}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3">
                <FaCar className="text-4xl text-slate-400" />
                <h2 className="text-white text-lg font-semibold">Vehicle Not Found</h2>
                <Link to="/fleet" className="btn-primary !text-sm">Back to Fleet</Link>
            </div>
        );
    }

    const colorMap = {
        Alto: 'from-blue-600 to-blue-900', WagonR: 'from-purple-600 to-purple-900', Every: 'from-cyan-600 to-cyan-900',
        Buddy: 'from-orange-600 to-orange-900', Premio: 'from-teal-600 to-teal-900', Axio: 'from-indigo-600 to-indigo-900',
        Aqua: 'from-emerald-600 to-emerald-900', Prius: 'from-fuchsia-600 to-fuchsia-900', Van: 'from-amber-600 to-amber-900',
        SUV: 'from-rose-600 to-rose-900', Other: 'from-slate-600 to-slate-900',
    };
    const bgGradient = colorMap[vehicle.category] || colorMap.Other;

    const validImages = vehicle.images?.length > 0 && !vehicle.images[0].includes('/vehicles/')
        ? vehicle.images.map((img) => img.startsWith('/') ? img : `/${img}`)
        : [];

    return (
        <div className="min-h-screen">
            <div className="container-app lg:max-w-5xl py-8">
                {/* Back */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-slate-400 hover:text-white mb-6 text-sm transition-colors">
                    <FiArrowLeft size={16} /> Back to Fleet
                </button>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <div>
                        <div className="glass-card overflow-hidden mb-4 rounded-2xl border border-white/10 shadow-2xl">
                            {validImages.length > 0 && !imgError ? (
                                <img
                                    src={validImages[selectedImage]}
                                    alt={vehicle.name}
                                    className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className={`w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br ${bgGradient} flex items-center justify-center`}>
                                    <FaCar className="text-white/20 text-8xl" />
                                </div>
                            )}
                        </div>
                        {validImages.length > 1 && !imgError && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {validImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-amber-500 shadow-lg shadow-amber-500/20' : 'border-transparent opacity-50 hover:opacity-100 hover:border-white/10'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-sm border border-amber-400">
                                {vehicle.category}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm border ${vehicle.available
                                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                                }`}>
                                {vehicle.available ? '● Available Right Now' : '○ Currently Booked'}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">{vehicle.name}</h1>

                        {vehicle.description && (
                            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">{vehicle.description}</p>
                        )}

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                            {[
                                { icon: FiUsers, val: vehicle.seats, label: 'Seats' },
                                { icon: FiSettings, val: vehicle.transmission, label: 'Transmission' },
                                { icon: FaGasPump, val: vehicle.fuelType, label: 'Fuel Type' },
                                { icon: FiCalendar, val: vehicle.year || 'N/A', label: 'Manufacturing Year' },
                            ].map((spec, i) => (
                                <div key={i} className="bg-slate-900/[0.03] border border-white/10 p-4 rounded-2xl text-center hover:bg-slate-900/[0.05] transition-colors">
                                    <spec.icon className="text-amber-500 mx-auto mb-2" size={20} />
                                    <div className="text-white font-semibold text-sm sm:text-base">{spec.val}</div>
                                    <div className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider">{spec.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Features */}
                        {vehicle.features?.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 opacity-80">Included Features</h3>
                                <div className="flex flex-wrap gap-2">
                                    {vehicle.features.map((f, i) => (
                                        <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/[0.02] hover:bg-slate-900/[0.05] transition-colors text-xs sm:text-sm text-slate-700 border border-white/10">
                                            <FiCheck className="text-amber-500" size={14} /> {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pricing & Book - Sticks to bottom */}
                        <div className="mt-auto">
                            <div className="glass-card p-6 border-amber-500/30 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl"></div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                                    <div>
                                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Rental Rate</span>
                                        <span className="text-4xl font-bold gradient-text tabular-nums">
                                            Rs. {vehicle.pricePerDay?.toLocaleString()}
                                        </span>
                                        <span className="text-slate-400 text-sm ml-2 font-medium">/ day</span>

                                        {vehicle.plateNumber && (
                                            <div className="mt-2 text-xs font-medium text-slate-400 bg-black/20 px-2 py-1 rounded inline-block">
                                                Plate: {vehicle.plateNumber}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleBookNow}
                                        disabled={!vehicle.available}
                                        className={`px-8 py-4 rounded-xl font-bold text-base transition-all shadow-xl ${vehicle.available
                                                ? 'btn-primary hover:scale-105 active:scale-95'
                                                : 'bg-slate-800 text-slate-400 shadow-none cursor-not-allowed border border-white/10'
                                            }`}
                                    >
                                        {vehicle.available ? (user ? 'Reserve Vehicle' : 'Sign In to Reserve') : 'Unavailable'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Vehicles */}
                {related.length > 0 && (
                    <div className="mt-20 pt-10 border-t border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white">
                                More <span className="gradient-text">{vehicle.category}</span> Options
                            </h2>
                            <Link to={`/fleet?category=${vehicle.category}`} className="text-sm font-medium text-amber-500 hover:text-white transition-colors">
                                View All {vehicle.category}s →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {related.map((v) => (
                                <div key={v._id} className="h-full">
                                    <VehicleCard vehicle={v} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VehicleDetailPage;
