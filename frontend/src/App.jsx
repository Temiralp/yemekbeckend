import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext"; // Default import
import AdminDashboard from "./components/dashboard/AdminDashboard";
import AdminOrders from "./components/dashboard/AdminOrders";
import AdminUsers from "./components/dashboard/AdminUsers";
import AdminLogin from "./components/AdminLogin";
import Login from "./components/Login";
import VerifyCode from "./components/VerifyCode";
import AdminSettings from "./components/dashboard/AdminSettings"
import AdminCoupon from "./components/dashboard/AdminCoupon"
import AdminProducts from "./components/dashboard/AdminProducts"
import AdminCategories from "./components/dashboard/AdminCategories"
import Profile from "./components/Profile";
import AddCoupon from "./components/dashboard/ADD/AddCoupon";
import EditCoupon from "./components/dashboard/ADD/EditCoupon";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/coupons" element={<AdminCoupon />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/coupons/add" element={<AddCoupon />} />
          <Route path="/admin/coupons/edit/:id" element={<EditCoupon />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;