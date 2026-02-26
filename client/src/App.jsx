import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import FleetPage from "./pages/FleetPage";
import VehicleDetailPage from "./pages/VehicleDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import BookingPage from "./pages/BookingPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageBookings from "./pages/admin/ManageBookings";
import ManageVehicles from "./pages/admin/ManageVehicles";
import ManageCustomers from "./pages/admin/ManageCustomers";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#334155",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              fontFamily: "Inter, sans-serif",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#ffffff" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
            },
          }}
        />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="/fleet" element={<FleetPage />} />
              <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Customer (Protected) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking/:id"
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin (Protected + Admin Only) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <ProtectedRoute adminOnly>
                    <ManageBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/vehicles"
                element={
                  <ProtectedRoute adminOnly>
                    <ManageVehicles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/customers"
                element={
                  <ProtectedRoute adminOnly>
                    <ManageCustomers />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
