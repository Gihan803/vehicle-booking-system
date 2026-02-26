import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats, getAdminBookings } from '../../services/api';
import { FiTruck, FiUsers, FiDollarSign, FiClock, FiCheckCircle, FiList, FiCalendar } from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const [statsRes, bookingsRes] = await Promise.all([
                    getAdminStats(),
                    getAdminBookings({ status: 'pending' }),
                ]);
                setStats(statsRes.data);
                setRecentBookings(bookingsRes.data.slice(0, 5));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const statCards = [
        { label: 'Total Vehicles', value: stats?.totalVehicles || 0, icon: FiTruck, iconColor: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Available', value: stats?.availableVehicles || 0, icon: FaCar, iconColor: 'text-green-400', bg: 'bg-green-500/10' },
        { label: 'Pending', value: stats?.pendingBookings || 0, icon: FiClock, iconColor: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        { label: 'Confirmed', value: stats?.confirmedBookings || 0, icon: FiCheckCircle, iconColor: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Customers', value: stats?.totalCustomers || 0, icon: FiUsers, iconColor: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Revenue', value: `Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: FiDollarSign, iconColor: 'text-amber-500', bg: 'bg-amber-500/20' },
    ];

    return (
        <div className="min-h-screen">
            <div className="container-app py-12">
                <div className="mb-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Admin <span className="gradient-text">Dashboard</span>
                    </h1>
                    <p className="text-slate-400 text-sm">Overview of your vehicle rental business</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-4 lg:gap-5 lg:gap-y-5 mb-12">
                    {statCards.map((card) => (
                        <div key={card.label} className="glass-card p-5">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`}>
                                    <card.icon className={`text-lg ${card.iconColor}`} />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-lg font-bold text-white truncate">{card.value}</div>
                                    <div className="text-slate-400 text-xs">{card.label}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="h-8 sm:h-12 w-full"></div>

                {/* Quick links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 gap-y-4 lg:gap-5 lg:gap-y-5 mb-12">
                    <Link to="/admin/bookings" className="glass-card p-5 flex items-center gap-4 group hover:border-amber-500/30">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <FiList className="text-amber-500 text-lg" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-white font-semibold text-sm">Manage Bookings</h3>
                            <p className="text-slate-400 text-xs mt-0.5">Review & approve</p>
                        </div>
                    </Link>
                    <Link to="/admin/vehicles" className="glass-card p-5 flex items-center gap-4 group hover:border-amber-500/30">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <FiTruck className="text-amber-500 text-lg" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-white font-semibold text-sm">Manage Fleet</h3>
                            <p className="text-slate-400 text-xs mt-0.5">Add, edit, remove</p>
                        </div>
                    </Link>
                    <Link to="/admin/customers" className="glass-card p-5 flex items-center gap-4 group hover:border-amber-500/30">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <FiUsers className="text-amber-500 text-lg" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-white font-semibold text-sm">Customers</h3>
                            <p className="text-slate-400 text-xs mt-0.5">View registered</p>
                        </div>
                    </Link>
                </div>

                <div className="h-8 sm:h-12 w-full"></div>

                {/* Pending bookings */}
                <div className="glass-card p-5 sm:p-6 mb-8 mt-12">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-white flex items-center gap-1.5">
                            <FiClock className="text-yellow-400" size={14} /> Pending Bookings
                        </h2>
                        <Link to="/admin/bookings" className="text-xs text-amber-500 hover:text-amber-500-light">
                            View All →
                        </Link>
                    </div>

                    {recentBookings.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-4">No pending bookings</p>
                    ) : (
                        <div className="space-y-2">
                            {recentBookings.map((booking) => (
                                <div key={booking._id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/[0.02] hover:bg-slate-900/[0.04] transition-colors">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                                            <FaCar className="text-yellow-400 text-xs" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-white text-xs font-medium truncate">{booking.vehicle?.name}</h4>
                                            <p className="text-slate-400 text-[10px]">{booking.customer?.name} · {formatDate(booking.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-3">
                                        <div className="text-amber-500 font-semibold text-xs">Rs. {booking.totalPrice?.toLocaleString()}</div>
                                        <div className="text-slate-400 text-[10px] flex items-center gap-0.5 justify-end">
                                            <FiCalendar size={8} /> {formatDate(booking.startDate)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
