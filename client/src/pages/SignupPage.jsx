import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaCar } from 'react-icons/fa';
import { FiUser, FiMail, FiLock, FiPhone, FiCreditCard, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SignupPage = () => {
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        nic: '',
        drivingLicense: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const { data } = await register({
                name: form.name,
                email: form.email,
                password: form.password,
                phone: form.phone,
                nic: form.nic,
                drivingLicense: form.drivingLicense,
            });
            loginUser(data.token, data.user);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center hero-gradient px-4 py-20">
            <div className="w-full max-w-lg">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center">
                            <FaCar className="text-white text-2xl" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-slate-400">Join Pelmadulla Taxi and start booking vehicles</p>
                </div>

                <div className="glass-card" style={{ padding: 'clamp(2rem, 5vw, 4rem)' }}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Full Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="input-field !pl-14 !pr-6"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="input-field !pl-14 !pr-6"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone & NIC */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1.5">Phone Number</label>
                                <div className="relative">
                                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="input-field !pl-14 !pr-6"
                                        placeholder="077 123 4567"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1.5">NIC / ID Number</label>
                                <div className="relative">
                                    <FiCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        name="nic"
                                        value={form.nic}
                                        onChange={handleChange}
                                        className="input-field !pl-14 !pr-6"
                                        placeholder="200012345678"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Driving License */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Driving License Number</label>
                            <div className="relative">
                                <FiCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    name="drivingLicense"
                                    value={form.drivingLicense}
                                    onChange={handleChange}
                                    className="input-field !pl-14 !pr-6"
                                    placeholder="DL-XXXXX"
                                    required
                                />
                            </div>
                        </div>

                        {/* Passwords */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1.5">Password</label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="input-field !pl-14 !pr-6"
                                        placeholder="Min 6 characters"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1.5">Confirm Password</label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        className="input-field !pl-14 !pr-6"
                                        placeholder="Re-enter password"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary !w-full justify-center !py-3 text-base !mt-8"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    Creating Account...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">Create Account <FiArrowRight /></span>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-amber-500 hover:text-amber-500-light font-medium">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
