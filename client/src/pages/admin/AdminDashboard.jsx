import { useState, useEffect } from "react";
import { getAdminStats, getAdminBookings } from "../../services/api";
import { FiTruck, FiUsers, FiDollarSign, FiClock, FiCheckCircle, FiList } from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import StatCard from "../../components/admin/StatCard";
import QuickLinkCard from "../../components/admin/QuickLinkCard";
import RecentBookings from "../../components/admin/RecentBookings";

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Vehicles", value: stats?.totalVehicles || 0, icon: FiTruck, iconColor: "text-blue-400" },
    { label: "Available", value: stats?.availableVehicles || 0, icon: FaCar, iconColor: "text-green-400" },
    { label: "Pending", value: stats?.pendingBookings || 0, icon: FiClock, iconColor: "text-blue-400" },
    { label: "Confirmed", value: stats?.confirmedBookings || 0, icon: FiCheckCircle, iconColor: "text-emerald-400" },
    { label: "Customers", value: stats?.totalCustomers || 0, icon: FiUsers, iconColor: "text-purple-400" },
    { label: "Revenue", value: `Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: FiDollarSign, iconColor: "text-blue-500" },
  ];

  const quickLinks = [
    { to: "/admin/bookings", label: "Manage Bookings", subtitle: "Review & Approve", icon: FiList, hoverColor: "hover:border-blue-600/30 hover:shadow-[0_0_20px_rgba(37,99,235,0.15)]", glowColor: "text-blue-500" },
    { to: "/admin/vehicles", label: "Manage Fleet", subtitle: "Add, Edit, Remove", icon: FiTruck, hoverColor: "hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]", glowColor: "text-blue-500" },
    { to: "/admin/customers", label: "Customers", subtitle: "View Registered", icon: FiUsers, hoverColor: "hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]", glowColor: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen">
      <div className="container-app py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-slate-400 text-sm">Overview of your vehicle rental business</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5 mb-12">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        <div className="h-8 sm:h-12 w-full" />

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5 mb-12">
          {quickLinks.map((link) => (
            <QuickLinkCard key={link.to} {...link} />
          ))}
        </div>

        <div className="h-8 sm:h-12 w-full" />

        {/* Pending Bookings */}
        <RecentBookings bookings={recentBookings} />

      </div>
    </div>
  );
};

export default AdminDashboard;
