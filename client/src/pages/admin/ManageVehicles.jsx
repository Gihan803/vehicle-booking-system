import { useState, useEffect } from "react";
import {
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} from "../../services/api";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiUsers,
  FiSettings,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Alto",
  "WagonR",
  "Every",
  "Buddy",
  "Premio",
  "Axio",
  "Aqua",
  "Prius",
  "Van",
  "SUV",
  "Other",
];

const emptyForm = {
  name: "",
  category: "Alto",
  pricePerDay: "",
  features: "",
  seats: "4",
  transmission: "Manual",
  fuelType: "Petrol",
  year: "",
  plateNumber: "",
  description: "",
  available: true,
};

const ManageVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data } = await getVehicles();
      setVehicles(data);
    } catch {
      toast.error("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditId(null);
    setForm(emptyForm);
    setImages([]);
    setShowModal(true);
  };

  const openEditModal = (vehicle) => {
    setEditId(vehicle._id);
    setForm({
      name: vehicle.name,
      category: vehicle.category,
      pricePerDay: vehicle.pricePerDay,
      features: vehicle.features?.join(", ") || "",
      seats: vehicle.seats,
      transmission: vehicle.transmission,
      fuelType: vehicle.fuelType,
      year: vehicle.year || "",
      plateNumber: vehicle.plateNumber || "",
      description: vehicle.description || "",
      available: vehicle.available,
    });
    setImages([]);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("pricePerDay", form.pricePerDay);
      formData.append(
        "features",
        JSON.stringify(
          form.features
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean),
        ),
      );
      formData.append("seats", form.seats);
      formData.append("transmission", form.transmission);
      formData.append("fuelType", form.fuelType);
      if (form.year) formData.append("year", form.year);
      if (form.plateNumber) formData.append("plateNumber", form.plateNumber);
      if (form.description) formData.append("description", form.description);
      formData.append("available", form.available);

      images.forEach((img) => formData.append("images", img));

      if (editId) {
        await updateVehicle(editId, formData);
        toast.success("Vehicle updated");
      } else {
        await addVehicle(formData);
        toast.success("Vehicle added");
      }

      setShowModal(false);
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?"))
      return;
    try {
      await deleteVehicle(id);
      toast.success("Vehicle deleted");
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container-app py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Manage <span className="gradient-text">Fleet</span>
            </h1>
            <p className="text-slate-400">
              {vehicles.length} vehicles in your fleet
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus /> Add Vehicle
          </button>
        </div>

        {/* Vehicle table */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass-card shimmer h-16" />
            ))}
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">
                      Vehicle
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium hidden sm:table-cell">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium hidden md:table-cell">
                      Specs
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">
                      Price/Day
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-slate-400 text-sm font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => (
                    <tr
                      key={v._id}
                      className="border-b border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                            <FaCar className="text-amber-500" />
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">
                              {v.name}
                            </div>
                            <div className="text-slate-400 text-xs">
                              {v.plateNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <span className="px-2 py-1 bg-amber-500/20 text-amber-500 text-xs rounded-md">
                          {v.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="flex gap-3 text-slate-400 text-xs">
                          <span className="flex items-center gap-1">
                            <FiUsers size={12} /> {v.seats}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiSettings size={12} /> {v.transmission}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-amber-500 font-semibold text-sm">
                          Rs. {v.pricePerDay?.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`badge ${v.available ? "badge-confirmed" : "badge-rejected"}`}
                        >
                          {v.available ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(v)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(v._id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8 overflow-y-auto">
          <div className="glass-card p-6 w-full max-w-xl my-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-xl font-bold text-white mb-6">
              {editId ? "Edit Vehicle" : "Add New Vehicle"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="input-field"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Price/Day (Rs.) *
                  </label>
                  <input
                    type="number"
                    value={form.pricePerDay}
                    onChange={(e) =>
                      setForm({ ...form, pricePerDay: e.target.value })
                    }
                    className="input-field"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Seats *
                  </label>
                  <input
                    type="number"
                    value={form.seats}
                    onChange={(e) =>
                      setForm({ ...form, seats: e.target.value })
                    }
                    className="input-field"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Transmission
                  </label>
                  <select
                    value={form.transmission}
                    onChange={(e) =>
                      setForm({ ...form, transmission: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Fuel Type
                  </label>
                  <select
                    value={form.fuelType}
                    onChange={(e) =>
                      setForm({ ...form, fuelType: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Plate Number
                </label>
                <input
                  type="text"
                  value={form.plateNumber}
                  onChange={(e) =>
                    setForm({ ...form, plateNumber: e.target.value })
                  }
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Features (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.features}
                  onChange={(e) =>
                    setForm({ ...form, features: e.target.value })
                  }
                  className="input-field"
                  placeholder="AC, Power Steering, USB"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="input-field resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages(Array.from(e.target.files))}
                  className="input-field !py-2"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={form.available}
                  onChange={(e) =>
                    setForm({ ...form, available: e.target.checked })
                  }
                  className="w-4 h-4 accent-secondary"
                />
                <label htmlFor="available" className="text-sm text-slate-700">
                  Available for booking
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 justify-center"
                >
                  {submitting
                    ? "Saving..."
                    : editId
                      ? "Update Vehicle"
                      : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVehicles;
