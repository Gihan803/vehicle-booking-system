import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVehicle, createBooking } from "../services/api";
import { FiCalendar, FiArrowLeft, FiCheck } from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import toast from "react-hot-toast";

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        startDate: "",
        endDate: "",
        notes: "",
    });

    useEffect(() => {
        fetchVehicle();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchVehicle = async () => {
        try {
            const { data } = await getVehicle(id);
            setVehicle(data);
        } catch {
            toast.error("Vehicle not found");
            navigate("/fleet");
        } finally {
            setLoading(false);
        }
    };

    const calculateDays = () => {
        if (!form.startDate || !form.endDate) return 0;
        const start = new Date(form.startDate);
        const end = new Date(form.endDate);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    };

    const totalPrice = calculateDays() * (vehicle?.pricePerDay || 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (calculateDays() <= 0) {
            toast.error("Please select valid dates");
            return;
        }

        setSubmitting(true);
        try {
            await createBooking({
                vehicleId: id,
                startDate: form.startDate,
                endDate: form.endDate,
                notes: form.notes,
            });
            toast.success("Booking request submitted! Waiting for admin approval.");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.response?.data?.message || "Booking failed");
        } finally {
            setSubmitting(false);
        }
    };

    // Get tomorrow's date as minimum start date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="container-app lg:max-w-3xl py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                >
                    <FiArrowLeft /> Back
                </button>

                <h1 className="text-3xl font-bold text-white mb-2">
                    Book <span className="gradient-text">{vehicle?.name}</span>
                </h1>
                <p className="text-slate-400 mb-8">
                    Fill in the details below to request a booking.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Booking form */}
                    <div className="md:col-span-2">
                        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">
                                        <FiCalendar className="inline mr-1" /> Pick-up Date
                                    </label>
                                    <input
                                        type="date"
                                        value={form.startDate}
                                        onChange={(e) =>
                                            setForm({ ...form, startDate: e.target.value })
                                        }
                                        min={minDate}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">
                                        <FiCalendar className="inline mr-1" /> Return Date
                                    </label>
                                    <input
                                        type="date"
                                        value={form.endDate}
                                        onChange={(e) =>
                                            setForm({ ...form, endDate: e.target.value })
                                        }
                                        min={form.startDate || minDate}
                                        className="input-field"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    className="input-field resize-none"
                                    rows={3}
                                    placeholder="Any special requests or notes..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || calculateDays() <= 0}
                                className="btn-primary !w-full justify-center !py-3.5 text-base"
                            >
                                {submitting ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        Submitting...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <FiCheck /> Submit Booking Request
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Summary */}
                    <div>
                        <div className="glass-card p-5 sticky top-24">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                                <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <FaCar className="text-amber-500 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-sm">
                                        {vehicle?.name}
                                    </h3>
                                    <p className="text-slate-400 text-xs">{vehicle?.category}</p>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Price/day</span>
                                    <span className="text-white">
                                        Rs. {vehicle?.pricePerDay?.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Duration</span>
                                    <span className="text-white">{calculateDays()} day(s)</span>
                                </div>
                                <div className="border-t border-white/10 pt-3 flex justify-between">
                                    <span className="text-white font-semibold">Total</span>
                                    <span className="text-xl font-bold gradient-text">
                                        Rs. {totalPrice.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-slate-400 mt-4">
                                Your booking will be reviewed by our admin. You'll see the
                                status in your dashboard.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
