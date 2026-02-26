import { useState, useEffect } from "react";
import { getCustomers } from "../../services/api";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCreditCard,
  FiCalendar,
} from "react-icons/fi";
import toast from "react-hot-toast";

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getCustomers();
        setCustomers(data);
      } catch {
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.nic.includes(search),
  );

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen">
      <div className="container-app py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              <span className="gradient-text">Customers</span>
            </h1>
            <p className="text-slate-400">
              {customers.length} registered customers
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or NIC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field max-w-md"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass-card shimmer h-20" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <FiUser className="text-4xl text-slate-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold">
              No customers found
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((customer) => (
              <div key={customer._id} className="glass-card p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold">
                      {customer.name}
                    </h3>
                    <div className="space-y-1 mt-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <FiMail
                          size={14}
                          className="text-slate-400 flex-shrink-0"
                        />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <FiPhone
                          size={14}
                          className="text-slate-400 flex-shrink-0"
                        />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <FiCreditCard
                          size={14}
                          className="text-slate-400 flex-shrink-0"
                        />
                        <span>NIC: {customer.nic}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <FiCreditCard
                          size={14}
                          className="text-slate-400 flex-shrink-0"
                        />
                        <span>DL: {customer.drivingLicense}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <FiCalendar size={12} />
                        <span>Joined: {formatDate(customer.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCustomers;
