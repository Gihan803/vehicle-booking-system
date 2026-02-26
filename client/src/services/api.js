import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");
export const updateProfile = (data) => API.put("/auth/profile", data);

// Vehicles (public)
export const getVehicles = (params) => API.get("/vehicles", { params });
export const getCategories = () => API.get("/vehicles/categories");
export const getVehicle = (id) => API.get(`/vehicles/${id}`);

// Bookings (customer)
export const createBooking = (data) => API.post("/bookings", data);
export const getMyBookings = () => API.get("/bookings/my");
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);

// Admin
export const getAdminStats = () => API.get("/admin/stats");
export const getAdminBookings = (params) =>
  API.get("/admin/bookings", { params });
export const updateBookingStatus = (id, data) =>
  API.put(`/admin/bookings/${id}`, data);
export const addVehicle = (data) => API.post("/admin/vehicles", data);
export const updateVehicle = (id, data) =>
  API.put(`/admin/vehicles/${id}`, data);
export const deleteVehicle = (id) => API.delete(`/admin/vehicles/${id}`);
export const getCustomers = () => API.get("/admin/customers");

export default API;
