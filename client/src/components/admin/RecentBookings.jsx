import { Link } from "react-router-dom";
import { FiClock, FiUsers } from "react-icons/fi";
import { FaCar } from "react-icons/fa";

const getStartDateParts = (dateString) => {
    const d = new Date(dateString);
    return {
        month: d.toLocaleDateString("en-US", { month: "short" }),
        day: d.getDate(),
        year: d.getFullYear(),
    };
};

const RecentBookings = ({ bookings }) => {
    return (
        <div className="glass-card p-6 sm:p-8 relative overflow-hidden flex flex-col h-full border border-white/10 rounded-3xl">
            {/* Watermark */}
            <FiClock className="absolute -right-8 -bottom-8 text-[15rem] text-white/5 rotate-[-15deg] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-8 relative z-10 text-white">
                <h2 className="text-xl font-bold flex items-center gap-3">
                    <FiClock className="text-blue-500" /> Pending Bookings
                </h2>
                <Link
                    to="/admin/bookings"
                    className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 group"
                >
                    View All <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </Link>
            </div>

            {/* Table */}
            <div className="relative z-10 overflow-x-auto overflow-y-visible">
                {bookings.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-8">No pending bookings</p>
                ) : (
                    <table className="glass-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Vehicle</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th className="text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => {
                                const dp = getStartDateParts(booking.startDate);
                                return (
                                    <tr key={booking._id} className="glass-table-row">
                                        <td>
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium text-sm sm:text-base tracking-tight">{dp.month} {dp.day}</span>
                                                <span className="text-slate-500 text-xs mt-0.5">{dp.year}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                                    <FaCar className="text-blue-400 text-base" />
                                                </div>
                                                <span className="text-slate-200 text-sm sm:text-base font-medium truncate max-w-[140px] sm:max-w-xs">
                                                    {booking.vehicle?.name || "Vehicle"}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                                                    <FiUsers className="text-purple-400 text-base" />
                                                </div>
                                                <span className="text-slate-200 text-sm sm:text-base font-medium truncate max-w-[140px] sm:max-w-[200px]">
                                                    {booking.customer?.name || "Customer"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap">
                                            <span className="badge badge-pending">Pending</span>
                                        </td>
                                        <td className="text-right whitespace-nowrap">
                                            <span className="text-white font-bold text-sm sm:text-base tracking-tight">
                                                Rs. {booking.totalPrice?.toLocaleString()}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default RecentBookings;
