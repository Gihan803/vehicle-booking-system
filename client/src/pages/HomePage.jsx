import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getVehicles } from "../services/api";
import VehicleCard from "../components/VehicleCard";
import {
  FaShieldAlt,
  FaThumbsUp,
  FaRegClock,
  FaCar,
  FaStar,
} from "react-icons/fa";
import { FiArrowRight, FiChevronDown } from "react-icons/fi";
import Footer from "../components/Footer";

/* ——— Scroll-reveal hook ——— */
const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.08 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

/* ——— Animated div ——— */
const Reveal = ({ children, className = "", delay = 0 }) => {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}
    >
      {children}
    </div>
  );
};

const STATS = [
  { value: "500+", label: "Happy Customers" },
  { value: "16", label: "Vehicles Available" },
  { value: "3+", label: "Years Experience" },
  { value: "24/7", label: "Customer Support" },
];

const FEATURES = [
  {
    icon: <FaShieldAlt className="text-4xl text-blue-400" />,
    title: "Fully Insured",
    desc: "Every vehicle in our fleet comes with comprehensive insurance so you can drive with complete peace of mind.",
  },
  {
    icon: <FaRegClock className="text-4xl text-blue-400" />,
    title: "24/7 Support",
    desc: "Our dedicated support team is available around the clock to assist you with any inquiry or issue.",
  },
  {
    icon: <FaThumbsUp className="text-4xl text-blue-400" />,
    title: "Best Prices",
    desc: "We offer highly competitive rates with strictly no hidden charges or last-minute surprises.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Browse Our Fleet",
    desc: "Explore our wide range of vehicles filtered by type, fuel, and transmission.",
  },
  {
    step: "02",
    title: "Make a Booking",
    desc: "Choose your dates, confirm your details, and submit your booking request.",
  },
  {
    step: "03",
    title: "Hit the Road",
    desc: "Booking confirmed — pick up your vehicle and enjoy the drive!",
  },
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVehicles({ available: true })
      .then((res) => setFeatured(res.data.slice(0, 3)))
      .catch((err) => console.error("Failed to load featured vehicles:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col bg-slate-900">
      {/* ================================================================
                HERO — Full Viewport
            ================================================================ */}
      <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

        <div className="container-app relative z-10 flex flex-col items-center text-center py-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 mb-8">
            <FaStar className="text-blue-400 text-xs" />
            <span className="text-blue-400 text-sm font-semibold tracking-wide">
              Pelmadulla's #1 Vehicle Rental
            </span>
            <FaStar className="text-blue-400 text-xs" />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 max-w-5xl">
            Find the Perfect Ride{" "}
            <span className="text-blue-400">for Any</span> Journey
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            Whether you need a compact car for city errands, a spacious van for
            a family trip, or a luxury SUV — we've got you covered with the best
            rates in town.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Link
              to="/fleet"
              className="inline-flex items-center gap-2 w-fit px-8 py-4 sm:px-10 sm:py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-1"
            >
              Browse Our Fleet <FiArrowRight />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 w-fit px-8 py-4 sm:px-10 sm:py-5 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg rounded-2xl border border-white/20 backdrop-blur-sm transition-all hover:-translate-y-1"
            >
              Create an Account
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 w-full max-w-3xl border-t border-white/10 pt-10">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-500">
                  {s.value}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-500 animate-bounce">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <FiChevronDown size={20} />
        </div>
      </section>

      {/* ================================================================
                WHY CHOOSE US — Full screen
            ================================================================ */}
      <section className="relative flex items-center justify-center min-h-screen bg-slate-900 border-t border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container-app py-20 w-full">
          <Reveal className="flex flex-col items-center text-center mb-16 w-full mx-auto">
            <span className="text-blue-600 text-sm font-bold uppercase tracking-widest">
              Why Choose Us
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mt-3">
              Reliable. Affordable.
              <br />
              <span className="text-blue-400">Always There.</span>
            </h2>
            <p className="text-slate-400 mt-5 max-w-xl mx-auto text-lg text-center">
              We pride ourselves on giving you a stress-free rental experience
              from start to finish.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <Reveal key={i} delay={i * 130}>
                <div className="group flex flex-col items-center text-center p-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-300 hover:-translate-y-2 h-full">
                  <div className="w-20 h-20 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center mb-8 group-hover:bg-blue-600/20 transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {f.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
                HOW IT WORKS — Full screen
            ================================================================ */}
      <section className="relative flex items-center justify-center min-h-screen bg-slate-800/70 border-y border-white/5 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container-app py-20 w-full">
          <Reveal className="flex flex-col items-center text-center mb-16 w-full mx-auto">
            <span className="text-blue-600 text-sm font-bold uppercase tracking-widest">
              Simple Process
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mt-3">
              Book in <span className="text-blue-400">3 Easy Steps</span>
            </h2>
            <p className="text-slate-400 mt-5 max-w-xl mx-auto text-lg text-center">
              Getting on the road with us is quick, simple, and entirely
              hassle-free.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {STEPS.map((item, i) => (
              <Reveal key={item.step} delay={i * 130}>
                <div className="relative flex flex-col p-10 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-600/30 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 h-full">
                  <span className="text-8xl font-extrabold text-white/5 select-none mb-6 leading-none">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                  <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                    <span className="text-blue-400 text-sm font-extrabold">
                      {i + 1}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
                FEATURED VEHICLES — Full screen
            ================================================================ */}
      <section className="relative flex items-center justify-center min-h-screen bg-slate-900 border-t border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container-app py-20 w-full">
          <Reveal className="flex flex-col items-center text-center mb-16 w-full mx-auto">
            <span className="text-blue-600 text-sm font-bold uppercase tracking-widest">
              Top Picks
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mt-3">
              Most <span className="text-blue-400">Popular</span> Vehicles
            </h2>
            <p className="text-slate-400 mt-5 max-w-xl mx-auto text-lg text-center">
              Our most frequently booked vehicles — highly reliable and ready
              for the road.
            </p>
          </Reveal>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="shimmer h-80 rounded-2xl opacity-20" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featured.map((v, i) => (
                <Reveal key={v._id} delay={i * 130}>
                  <VehicleCard vehicle={v} />
                </Reveal>
              ))}
            </div>
          )}

          <Reveal className="flex justify-center mt-14">
            <Link
              to="/fleet"
              className="inline-flex items-center gap-3 w-fit px-10 py-4 sm:px-12 sm:py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-blue-600/25 transition-all hover:-translate-y-1"
            >
              View All Vehicles <FiArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ================================================================
                FINAL CTA — Full screen amber gradient
            ================================================================ */}
      <section className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-500">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] pointer-events-none" />

        <div className="container-app relative z-10 text-center py-20">
          <Reveal className="flex flex-col items-center text-center w-full mx-auto">
            <FaCar className="text-white/80 text-7xl mx-auto mb-8 drop-shadow-lg" />
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow leading-tight">
              Ready to Hit
              <br />
              the Road?
            </h2>
            <p className="text-amber-100 text-xl mb-12 max-w-xl mx-auto text-center">
              Sign up now and get instant access to our entire fleet at
              unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center w-fit px-8 py-4 sm:px-10 sm:py-5 bg-white text-blue-600 font-extrabold text-lg rounded-2xl shadow-2xl transition-all hover:-translate-y-1 hover:shadow-white/40"
              >
                Create Free Account
              </Link>
              <Link
                to="/fleet"
                className="inline-flex items-center justify-center w-fit px-8 py-4 sm:px-10 sm:py-5 bg-white/20 hover:bg-white/30 text-white font-semibold text-lg rounded-2xl border border-white/30 backdrop-blur-sm transition-all hover:-translate-y-1"
              >
                Browse Fleet First
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
