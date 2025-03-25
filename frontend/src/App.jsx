import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext"; // Default import
import AdminDashboard from "./components/dashboard/AdminDashboard";
import AdminOrders from "./components/dashboard/AdminOrders";
import AdminUsers from "./components/dashboard/AdminUsers";
import AdminLogin from "./components/AdminLogin";
import Login from "./components/Login";
import VerifyCode from "./components/VerifyCode";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-code" element={<VerifyCode />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;