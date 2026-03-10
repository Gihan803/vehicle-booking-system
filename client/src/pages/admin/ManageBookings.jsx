import { useState, useEffect } from "react";
import { getAdminBookings, updateBookingStatus } from "../../services/api";
import {
    FiCheck,
    FiX,
    FiCalendar,
    FiUser,
    FiPhone,
    FiCreditCard,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import toast from "react-hot-toast";

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("pending");
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        fetchBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const params = filter === "all" ? {} : { status: filter };
            const { data } = await getAdminBookings(params);
            setBookings(data);
        } catch {
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await updateBookingStatus(id, { status: "confirmed" });
            toast.success("Booking confirmed!");
            fetchBookings();
        } catch {
            toast.error("Failed to approve");
        }
    };

    const handleReject = async () => {
        if (!rejectModal) return;
        try {
            await updateBookingStatus(rejectModal, {
                status: "rejected",
                rejectionReason: rejectReason,
            });
            toast.success("Booking rejected");
            setRejectModal(null);
            setRejectReason("");
            fetchBookings();
        } catch {
            toast.error("Failed to reject");
        }
    };

    const handleComplete = async (id) => {
        try {
            await updateBookingStatus(id, { status: "completed" });
            toast.success("Booking marked as completed");
            fetchBookings();
        } catch {
            toast.error("Failed to update");
        }
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    const statusColors = {
        pending: "badge-pending",
        confirmed: "badge-confirmed",
        rejected: "badge-rejected",
        cancelled: "badge-cancelled",
        completed: "badge-completed",
    };

    return (
        <div className="min-h-screen">
            <div className="container-app py-8">
                <h1 className="text-3xl font-bold text-white mb-1">
                    Manage <span className="gradient-text">Bookings</span>
                </h1>
                <p className="text-slate-400 mb-6">
                    Review and manage all booking requests
                </p>
                <div className="h-8" />
                {/* Filter tabs */}
                <div className="inline-flex gap-1 overflow-x-auto hide-scrollbar mb-8 bg-slate-800/80 p-1.5 rounded-full border border-white/10 shadow-sm">
                    {["pending", "confirmed", "rejected", "completed", "all"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all duration-200 ${filter === f
                                ? "bg-amber-500 text-slate-900 font-semibold shadow-md"
                                : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="h-8" />
                {/* Bookings */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="glass-card shimmer h-40" />
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <FaCar className="text-4xl text-slate-400 mx-auto mb-4" />
                        <h3 className="text-white text-lg font-semibold">
                            No {filter} bookings
                        </h3>
                    </div>
                ) : (
                    <div className="relative z-10 overflow-x-auto overflow-y-visible">
                        <table className="glass-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Vehicle</th>
                                    <th>Customer</th>
                                    <th>Status</th>
                                    <th className="text-right">Amount</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => {
                                    const dpStart = new Date(booking.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                                    const dpEnd = new Date(booking.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });

                                    return (
                                        <tr key={booking._id} className="glass-table-row">
                                            {/* Date Column */}
                                            <td>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium text-sm sm:text-base tracking-tight">{dpStart}</span>
                                                    <span className="text-slate-500 text-xs mt-0.5">to {dpEnd}</span>
                                                </div>
                                            </td>

                                            {/* Vehicle Column */}
                                            <td>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                                        <FaCar className="text-blue-400 text-base" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-slate-200 text-sm sm:text-base font-medium truncate max-w-[140px] sm:max-w-xs">{booking.vehicle?.name || "Vehicle"}</span>
                                                        <span className="text-slate-500 text-xs">{booking.vehicle?.category}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Customer Column */}
                                            <td>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                                                        <FiUser className="text-purple-400 text-base" />
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-slate-200 text-sm sm:text-base font-medium truncate max-w-[140px] sm:max-w-[200px]">{booking.customer?.name || "Customer"}</span>
                                                        <span className="text-slate-500 text-xs flex items-center gap-1">
                                                            <FiPhone size={10} /> {booking.customer?.phone}
                                                        </span>
                                                        <span className="text-slate-500 text-xs line-clamp-1 py-0.5">
                                                            NIC: {booking.customer?.nic} | DL: {booking.customer?.drivingLicense}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status Column */}
                                            <td className="whitespace-nowrap">
                                                <span className={`badge ${statusColors[booking.status]}`}>
                                                    {booking.status}
                                                </span>
                                                {booking.rejectionReason && (
                                                    <div className="text-red-400 text-xs mt-1 w-24 truncate" title={booking.rejectionReason}>
                                                        {booking.rejectionReason}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Amount Column */}
                                            <td className="text-right whitespace-nowrap">
                                                <span className="text-white font-bold text-sm sm:text-base tracking-tight">Rs. {booking.totalPrice?.toLocaleString()}</span>
                                            </td>

                                            {/* Actions Column */}
                                            <td className="text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    {booking.status === "pending" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(booking._id)}
                                                                className="btn-success flex items-center justify-center w-8 h-8 rounded-lg !p-0"
                                                                title="Approve"
                                                            >
                                                                <FiCheck size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => setRejectModal(booking._id)}
                                                                className="btn-danger flex items-center justify-center w-8 h-8 rounded-lg !p-0"
                                                                title="Reject"
                                                            >
                                                                <FiX size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                    {booking.status === "confirmed" && (
                                                        <button
                                                            onClick={() => handleComplete(booking._id)}
                                                            className="btn-primary !px-3 py-1.5 !text-xs rounded-lg"
                                                        >
                                                            Complete
                                                        </button>
                                                    )}
                                                    {booking.status !== "pending" && booking.status !== "confirmed" && (
                                                        <span className="text-slate-600 text-xs font-medium">-</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Reject modal */}
            {rejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="glass-card p-6 w-full max-w-md">
                        <h3 className="text-white font-semibold text-lg mb-4">
                            Reject Booking
                        </h3>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection (optional)..."
                            className="input-field resize-none mb-4"
                            rows={3}
                        />
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setRejectModal(null);
                                    setRejectReason("");
                                }}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button onClick={handleReject} className="btn-danger">
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBookings;
