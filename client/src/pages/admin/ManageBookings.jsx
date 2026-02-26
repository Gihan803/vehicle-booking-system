import { useState, useEffect } from 'react';
import { getAdminBookings, updateBookingStatus } from '../../services/api';
import { FiCheck, FiX, FiCalendar, FiUser, FiPhone, FiCreditCard } from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        fetchBookings();
    }, [filter]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const params = filter === 'all' ? {} : { status: filter };
            const { data } = await getAdminBookings(params);
            setBookings(data);
        } catch (err) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await updateBookingStatus(id, { status: 'confirmed' });
            toast.success('Booking confirmed!');
            fetchBookings();
        } catch (err) {
            toast.error('Failed to approve');
        }
    };

    const handleReject = async () => {
        if (!rejectModal) return;
        try {
            await updateBookingStatus(rejectModal, { status: 'rejected', rejectionReason: rejectReason });
            toast.success('Booking rejected');
            setRejectModal(null);
            setRejectReason('');
            fetchBookings();
        } catch (err) {
            toast.error('Failed to reject');
        }
    };

    const handleComplete = async (id) => {
        try {
            await updateBookingStatus(id, { status: 'completed' });
            toast.success('Booking marked as completed');
            fetchBookings();
        } catch (err) {
            toast.error('Failed to update');
        }
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    const statusColors = {
        pending: 'badge-pending',
        confirmed: 'badge-confirmed',
        rejected: 'badge-rejected',
        cancelled: 'badge-cancelled',
        completed: 'badge-completed',
    };

    return (
        <div className="min-h-screen">
            <div className="container-app py-8">
                <h1 className="text-3xl font-bold text-white mb-1">
                    Manage <span className="gradient-text">Bookings</span>
                </h1>
                <p className="text-slate-400 mb-6">Review and manage all booking requests</p>

                {/* Filter tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {['pending', 'confirmed', 'rejected', 'completed', 'all'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${filter === f ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Bookings */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => <div key={i} className="glass-card shimmer h-40" />)}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <FaCar className="text-4xl text-slate-400 mx-auto mb-4" />
                        <h3 className="text-white text-lg font-semibold">No {filter} bookings</h3>
                    </div>
                ) : (
                    <div className="flex flex-col gap-10">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="glass-card p-5 sm:p-6">
                                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                    {/* Vehicle info */}
                                    <div className="flex items-center gap-3 lg:w-48 flex-shrink-0">
                                        <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center">
                                            <FaCar className="text-amber-500 text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold text-sm">{booking.vehicle?.name}</h3>
                                            <p className="text-slate-400 text-xs">{booking.vehicle?.category}</p>
                                            <span className={`badge ${statusColors[booking.status]} mt-1 inline-block`}>{booking.status}</span>
                                        </div>
                                    </div>

                                    {/* Customer info */}
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-slate-200">
                                                <FiUser size={14} className="text-amber-500" />
                                                <span>{booking.customer?.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <FiPhone size={14} className="text-slate-400" />
                                                <span>{booking.customer?.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <FiCreditCard size={14} className="text-slate-400" />
                                                <span>NIC: {booking.customer?.nic}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <FiCreditCard size={14} className="text-slate-400" />
                                                <span>DL: {booking.customer?.drivingLicense}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-slate-200">
                                                <FiCalendar size={14} className="text-amber-500" />
                                                <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                                            </div>
                                            <div className="text-amber-500 font-semibold">
                                                Total: Rs. {booking.totalPrice?.toLocaleString()}
                                            </div>
                                            {booking.notes && (
                                                <div className="text-slate-400 text-xs italic">Note: {booking.notes}</div>
                                            )}
                                            {booking.rejectionReason && (
                                                <div className="text-red-400 text-xs">Reason: {booking.rejectionReason}</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 lg:flex-col lg:items-end flex-shrink-0">
                                        {booking.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleApprove(booking._id)} className="btn-success flex items-center gap-1 !text-xs">
                                                    <FiCheck size={14} /> Approve
                                                </button>
                                                <button onClick={() => setRejectModal(booking._id)} className="btn-danger flex items-center gap-1 !text-xs">
                                                    <FiX size={14} /> Reject
                                                </button>
                                            </>
                                        )}
                                        {booking.status === 'confirmed' && (
                                            <button onClick={() => handleComplete(booking._id)} className="btn-primary !text-xs">
                                                Complete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reject modal */}
            {rejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="glass-card p-6 w-full max-w-md">
                        <h3 className="text-white font-semibold text-lg mb-4">Reject Booking</h3>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection (optional)..."
                            className="input-field resize-none mb-4"
                            rows={3}
                        />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => { setRejectModal(null); setRejectReason(''); }} className="btn-secondary">
                                Cancel
                            </button>
                            <button onClick={handleReject} className="btn-danger">Reject</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBookings;
