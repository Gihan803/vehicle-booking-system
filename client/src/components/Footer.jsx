import { Link } from "react-router-dom";
import { FaCar, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-white/10">
      <div className="container-app py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center">
                <FaCar className="text-white text-xs" />
              </div>
              <span className="font-bold text-white text-sm">
                Pelmadulla<span className="gradient-text">Taxi</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Your trusted vehicle rental service in Pelmadulla. Quality
              vehicles, affordable prices, reliable service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Quick Links
            </h3>
            <ul className="space-y-1.5">
              {[
                { to: "/", label: "Home" },
                { to: "/fleet", label: "Our Fleet" },
                { to: "/signup", label: "Register" },
                { to: "/login", label: "Login" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-amber-500 text-xs transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Categories
            </h3>
            <ul className="space-y-1.5">
              {["Alto", "WagonR", "Premio", "Van", "SUV"].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/fleet?category=${cat}`}
                    className="text-slate-400 hover:text-amber-500 text-xs transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-slate-400 text-xs">
                <FaMapMarkerAlt
                  className="text-slate-400 mt-0.5 flex-shrink-0"
                  size={11}
                />
                <span>Pelmadulla, Ratnapura District, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-xs">
                <FaPhone className="text-slate-400 flex-shrink-0" size={11} />
                <span>+94 77 123 4567</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-xs">
                <FaEnvelope
                  className="text-slate-400 flex-shrink-0"
                  size={11}
                />
                <span>info@pelmadullatxi.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-slate-400 text-[11px]">
            © {new Date().getFullYear()} Pelmadulla Taxi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
