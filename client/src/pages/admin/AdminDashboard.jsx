import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminStats, getAdminBookings } from "../../services/api";
import {
  FiTruck,
  FiUsers,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiList,
  FiCalendar,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          getAdminStats(),
          getAdminBookings({ status: "pending" }),
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

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const getStartDateParts = (dateString) => {
    const d = new Date(dateString);
    return {
      month: d.toLocaleDateString("en-US", { month: "short" }),
      day: d.getDate(),
      year: d.getFullYear(),
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Vehicles",
      value: stats?.totalVehicles || 0,
      icon: FiTruck,
      iconColor: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Available",
      value: stats?.availableVehicles || 0,
      icon: FaCar,
      iconColor: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Pending",
      value: stats?.pendingBookings || 0,
      icon: FiClock,
      iconColor: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Confirmed",
      value: stats?.confirmedBookings || 0,
      icon: FiCheckCircle,
      iconColor: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Customers",
      value: stats?.totalCustomers || 0,
      icon: FiUsers,
      iconColor: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Revenue",
      value: `Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: FiDollarSign,
      iconColor: "text-amber-500",
      bg: "bg-amber-500/20",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="container-app py-12">
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Overview of your vehicle rental business
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5 mb-12">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="glass-card border border-white/10 p-6 sm:p-8 relative overflow-hidden flex flex-col justify-center items-center text-center min-h-[130px] sm:min-h-[150px]"
            >
              {/* Background Watermark Icon */}
              <card.icon
                className={`absolute -bottom-4 -right-4 text-[5rem] sm:text-[6rem] opacity-[0.05] z-0 ${card.iconColor}`}
              />

              <div className="text-slate-400 text-sm sm:text-base font-medium leading-snug relative z-10 w-full">
                {card.label}
              </div>

              <div className="flex items-center justify-center mt-5 sm:mt-6 relative z-10 w-full">
                {/* Accent vertical line */}
                <div className={`w-1 h-6 sm:w-1.5 sm:h-8 rounded-full bg-current ${card.iconColor}`} />

                {/* Value / Number */}
                <div className={`ml-4 sm:ml-6 text-4xl sm:text-5xl font-bold tracking-tight leading-none ${card.iconColor}`}>
                  {card.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-8 sm:h-12 w-full"></div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5 mb-12">
          <Link
            to="/admin/bookings"
            className="glass-card border border-white/10 p-6 sm:p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center items-center text-center min-h-[130px] sm:min-h-[150px] hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]"
          >
            {/* Background Watermark Icon */}
            <FiList className="absolute -bottom-4 -right-4 text-[5rem] sm:text-[6rem] opacity-[0.05] group-hover:opacity-[0.15] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 z-0 text-amber-500" />

            <div className="text-slate-400 text-sm sm:text-base font-medium leading-snug relative z-10 w-full">
              Manage Bookings
            </div>

            <div className="flex items-center justify-center mt-3 sm:mt-4 relative z-10 w-full">
              {/* Value / Main Text */}
              <div className="text-xl sm:text-2xl font-bold tracking-tight leading-none text-white">
                Review & Approve
              </div>
            </div>
          </Link>

          <Link
            to="/admin/vehicles"
            className="glass-card border border-white/10 p-6 sm:p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center items-center text-center min-h-[130px] sm:min-h-[150px] hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
          >
            <FiTruck className="absolute -bottom-4 -right-4 text-[5rem] sm:text-[6rem] opacity-[0.05] group-hover:opacity-[0.15] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 z-0 text-blue-500" />

            <div className="text-slate-400 text-sm sm:text-base font-medium leading-snug relative z-10 w-full">
              Manage Fleet
            </div>

            <div className="flex items-center justify-center mt-3 sm:mt-4 relative z-10 w-full">
              <div className="text-xl sm:text-2xl font-bold tracking-tight leading-none text-white">
                Add, Edit, Remove
              </div>
            </div>
          </Link>

          <Link
            to="/admin/customers"
            className="glass-card border border-white/10 p-6 sm:p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center items-center text-center min-h-[130px] sm:min-h-[150px] hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
          >
            <FiUsers className="absolute -bottom-4 -right-4 text-[5rem] sm:text-[6rem] opacity-[0.05] group-hover:opacity-[0.15] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 z-0 text-purple-500" />

            <div className="text-slate-400 text-sm sm:text-base font-medium leading-snug relative z-10 w-full">
              Customers
            </div>

            <div className="flex items-center justify-center mt-3 sm:mt-4 relative z-10 w-full">
              <div className="text-xl sm:text-2xl font-bold tracking-tight leading-none text-white">
                View Registered
              </div>
            </div>
          </Link>
        </div>

        <div className="h-8 sm:h-12 w-full"></div>

        {/* Pending bookings */}
        <div className="glass-card p-6 sm:p-8 relative overflow-hidden flex flex-col h-full border border-white/10 rounded-3xl">
          {/* Watermark Icon */}
          <FiClock className="absolute -right-8 -bottom-8 text-[15rem] text-white/5 rotate-[-15deg] pointer-events-none" />

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

          <div className="relative z-10 overflow-x-auto overflow-y-visible">
            {recentBookings.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">
                No pending bookings
              </p>
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
                  {recentBookings.map((booking) => {
                    const dp = getStartDateParts(booking.startDate);
                    return (
                      <tr
                        key={booking._id}
                        className="glass-table-row"
                      >
                        {/* Date Column */}
                        <td>
                          <div className="flex flex-col">
                            <span className="text-white font-medium text-sm sm:text-base tracking-tight">{dp.month} {dp.day}</span>
                            <span className="text-slate-500 text-xs mt-0.5">{dp.year}</span>
                          </div>
                        </td>

                        {/* Vehicle Column */}
                        <td>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                              <FaCar className="text-blue-400 text-base" />
                            </div>
                            <span className="text-slate-200 text-sm sm:text-base font-medium truncate max-w-[140px] sm:max-w-xs">{booking.vehicle?.name || "Vehicle"}</span>
                          </div>
                        </td>

                        {/* Customer Column */}
                        <td>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                              <FiUsers className="text-purple-400 text-base" />
                            </div>
                            <span className="text-slate-200 text-sm sm:text-base font-medium truncate max-w-[140px] sm:max-w-[200px]">{booking.customer?.name || "Customer"}</span>
                          </div>
                        </td>

                        {/* Status Column */}
                        <td className="whitespace-nowrap">
                          <span className="badge badge-pending">
                            Pending
                          </span>
                        </td>

                        {/* Amount Column */}
                        <td className="text-right whitespace-nowrap">
                          <span className="text-white font-bold text-sm sm:text-base tracking-tight">Rs. {booking.totalPrice?.toLocaleString()}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
