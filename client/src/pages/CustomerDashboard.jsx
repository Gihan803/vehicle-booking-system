import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyBookings, cancelBooking } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FiCalendar, FiClock, FiDollarSign, FiX } from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import toast from "react-hot-toast";

const CustomerDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data } = await getMyBookings();
            setBookings(data);
        } catch (err) {
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?"))
            return;
        try {
            await cancelBooking(id);
            toast.success("Booking cancelled");
            fetchBookings();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to cancel");
        }
    };

    const filteredBookings =
        filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

    const statusColors = {
        pending: "badge-pending",
        confirmed: "badge-confirmed",
        rejected: "badge-rejected",
        cancelled: "badge-cancelled",
        completed: "badge-completed",
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    return (
        <div className="min-h-screen">
            <div className="container-app lg:max-w-5xl py-12">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome, <span className="gradient-text">{user?.name}</span>
                    </h1>
                    <p className="text-slate-400">
                        Manage your vehicle bookings and track their status.
                    </p>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 gap-y-4 lg:gap-5 lg:gap-y-5 mb-12">
                    {[
                        { label: "Total", value: bookings.length, color: "text-white" },
                        {
                            label: "Pending",
                            value: bookings.filter((b) => b.status === "pending").length,
                            color: "text-yellow-400",
                        },
                        {
                            label: "Confirmed",
                            value: bookings.filter((b) => b.status === "confirmed").length,
                            color: "text-green-400",
                        },
                        {
                            label: "Rejected",
                            value: bookings.filter((b) => b.status === "rejected").length,
                            color: "text-red-400",
                        },
                    ].map((s) => (
                        <div key={s.label} className="glass-card p-5 text-center">
                            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                            <div className="text-slate-400 text-sm mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="h-8 sm:h-12 w-full"></div>

                {/* Filter tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {[
                        "all",
                        "pending",
                        "confirmed",
                        "rejected",
                        "cancelled",
                        "completed",
                    ].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${filter === f
                                ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                                : "text-slate-400 hover:text-white hover:bg-white/10 border border-transparent"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="h-4 sm:h-4 w-full"></div>

                {/* Bookings list */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="glass-card shimmer h-32" />
                        ))}
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <FaCar className="text-4xl text-slate-400 mx-auto mb-4" />
                        <h3 className="text-white text-lg font-semibold mb-2">
                            No Bookings Found
                        </h3>
                        <p className="text-slate-400 mb-4">
                            {filter === "all"
                                ? "You haven't made any bookings yet."
                                : `No ${filter} bookings.`}
                        </p>
                        <Link to="/fleet" className="btn-primary">
                            Browse Vehicles
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-10">
                        {filteredBookings.map((booking) => (
                            <div key={booking._id} className="glass-card p-5 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    {/* Vehicle image */}
                                    <div className="w-full sm:w-28 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                                        {booking.vehicle?.images?.[0] ? (
                                            <img
                                                src={booking.vehicle.images[0]}
                                                alt={booking.vehicle.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FaCar className="text-slate-400 text-xl" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div>
                                                <h3 className="text-white text-lg font-bold mb-0.5 max-w-[200px] sm:max-w-md truncate">
                                                    {booking.vehicle?.name || "Vehicle"}
                                                </h3>
                                                <span className="text-slate-400 text-sm font-medium">
                                                    {booking.vehicle?.category}
                                                </span>
                                            </div>

                                            {/* Status Badge & Action Container */}
                                            <div className="flex items-center gap-3 shrink-0">
                                                <span className={`badge ${statusColors[booking.status]} mb-0`}>
                                                    {booking.status}
                                                </span>
                                                {booking.status === "pending" && (
                                                    <button
                                                        onClick={() => handleCancel(booking._id)}
                                                        className="btn-danger !py-1.5 !px-3 !text-xs flex items-center gap-1.5 whitespace-nowrap"
                                                    >
                                                        <FiX size={14} /> Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Specs List */}
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate-400 font-medium bg-white/5 p-3 rounded-xl border border-white/5 w-fit">
                                            <span className="flex items-center gap-1.5">
                                                <FiCalendar size={14} className="text-amber-500" />
                                                {formatDate(booking.startDate)} -{" "}
                                                {formatDate(booking.endDate)}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <FiDollarSign size={14} className="text-amber-500" />
                                                Rs. {booking.totalPrice?.toLocaleString()}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <FiClock size={14} className="text-amber-500" />
                                                {formatDate(booking.createdAt)}
                                            </span>
                                        </div>

                                        {booking.rejectionReason && (
                                            <p className="mt-3 text-sm text-red-400 bg-red-500/10 px-4 py-3 rounded-lg border border-red-500/20">
                                                <span className="font-semibold text-red-300">Reason:</span> {booking.rejectionReason}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Profile section */}
                <div className="mt-16">
                    <h2 className="text-xl font-bold text-white mb-6">Your Profile</h2>
                    <div className="glass-card p-6 sm:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-400">Name</span>
                                <p className="text-white font-medium">{user?.name}</p>
                            </div>
                            <div>
                                <span className="text-slate-400">Email</span>
                                <p className="text-white font-medium">{user?.email}</p>
                            </div>
                            <div>
                                <span className="text-slate-400">Phone</span>
                                <p className="text-white font-medium">{user?.phone}</p>
                            </div>
                            <div>
                                <span className="text-slate-400">NIC</span>
                                <p className="text-white font-medium">{user?.nic}</p>
                            </div>
                            <div>
                                <span className="text-slate-400">Driving License</span>
                                <p className="text-white font-medium">{user?.drivingLicense}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
