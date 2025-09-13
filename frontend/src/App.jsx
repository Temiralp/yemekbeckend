import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import AdminOrders from "./components/dashboard/AdminOrders";
import AdminUsers from "./components/dashboard/AdminUsers";
import AdminLogin from "./components/AdminLogin";
import Login from "./components/Login";
import Register from "./components/Register";
import VerifyCode from "./components/VerifyCode";
import AdminSettings from "./components/dashboard/AdminSettings";
import AdminCategories from "./components/dashboard/AdminCategories";
import Profile from "./components/Profile";
import AdminProducts from "./components/dashboard/AdminProducts";
import AddProduct from "./components/dashboard/ADD/AddProduct";
import AdminCoupon from "./components/dashboard/AdminCoupon";
import AddCoupon from "./components/dashboard/ADD/AddCoupon";
import EditCoupon from "./components/dashboard/ADD/EditCoupon";
import EditProduct from "./components/dashboard/ADD/EditProduct";
import AddCategory from "./components/dashboard/ADD/AddCategories";
import EditCategory from "./components/dashboard/ADD/EditCategories";
import Products from "./components/Products";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      <Route path="/admin/orders" element={<AdminOrders />} />

      <Route path="/admin/users" element={<AdminUsers />} />

      <Route path="/admin/settings" element={<AdminSettings />} />

      <Route path="/admin/categories" element={<AdminCategories />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/coupons" element={<AdminCoupon />} />

      <Route path="/admin/categories/add" element={<AddCategory />} />
      <Route path="/admin/products/add" element={<AddProduct />} />
      <Route path="/admin/coupons/add" element={<AddCoupon />} />

      <Route path="/admin/categories/edit/:id" element={<EditCategory />} />
      <Route path="/admin/products/edit/:id" element={<EditProduct />} />
      <Route path="/admin/coupons/edit/:id" element={<EditCoupon />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  );
};

export default App;
