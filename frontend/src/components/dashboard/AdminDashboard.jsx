import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Birleşik context
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaShoppingCart, FaUsers, FaMoneyBillWave } from "react-icons/fa";
import Sidebar from "./Sidebar";
import api from "../../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const { admin, token, logout } = useContext(AuthContext); // token da alınıyor
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(3600); // 1 saat
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
  });

  // Sidebar responsive kontrolü
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Admin kontrolü ve oturum başlatma
  useEffect(() => {
    if (!admin || !token) {
      navigate("/admin/login");
    } else {
      setSessionStartTime(Date.now());
      fetchDashboardData(); // Verileri çek
    }
  }, [admin, token, navigate]);

  // Oturum süresi sayacı
  useEffect(() => {
    let timer;
    if (sessionStartTime) {
      timer = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - sessionStartTime) / 1000);
        const newRemainingTime = 3600 - elapsedTime;
        if (newRemainingTime >= 0) {
          setRemainingTime(newRemainingTime);
        } else {
          logout();
          navigate("/admin/login");
          clearInterval(timer);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionStartTime, logout, navigate]);

  // Dashboard verilerini API'den çekme
  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData({
        totalOrders: response.data.totalOrders || 0,
        totalRevenue: response.data.totalRevenue || 0,
        activeUsers: response.data.activeUsers || 0,
      });
    } catch (err) {
      console.error("Dashboard verisi alınamadı:", err);
    }
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/admin/login");
    setIsLogoutModalOpen(false);
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
  };

  const lineChartData = {
    labels: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"],
    datasets: [
      {
        label: "Aylık Sipariş Sayısı",
        data: [30, 45, 60, 50, 70, 90], // API'den dinamik gelebilir
        borderColor: "#3498db",
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"],
    datasets: [
      {
        label: "Aylık Gelir (TL)",
        data: [5000, 7000, 9000, 6000, 8000, 12000], // API'den dinamik gelebilir
        backgroundColor: "#2ecc71",
        borderColor: "#27ae60",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Aylık Veriler" },
    },
  };

  if (!admin) return null;

  return (
    <div className="admin-dashboard">
      <header className="header">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={isSidebarOpen ? "menu-icon-open" : "menu-icon-closed"}
          >
            <path
              className="line1"
              d="M4 6H20"
              stroke="#fff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="line2"
              d="M4 12H14"
              stroke="#fff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="line3"
              d="M4 18H9"
              stroke="#fff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="header-title">Yönetim Paneli</h1>
      </header>

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleLogoutClick={handleLogoutClick} // Yorum satırı kaldırıldı
      />

      <main
        className={`main-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <section className="dashboard-section">
          <div className="dashboard-cards">
            <div className="card">
              <div className="card-icon">
                <FaShoppingCart />
              </div>
              <div className="card-content">
                <h3>Toplam Sipariş</h3>
                <p>{dashboardData.totalOrders}</p>
              </div>
            </div>
            <div className="card">
              <div className="card-icon">
                <FaMoneyBillWave />
              </div>
              <div className="card-content">
                <h3>Toplam Gelir</h3>
                <p>{dashboardData.totalRevenue} TL</p>
              </div>
            </div>
            <div className="card">
              <div className="card-icon">
                <FaUsers />
              </div>
              <div className="card-content">
                <h3>Aktif Kullanıcılar</h3>
                <p>{dashboardData.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="dashboard-charts">
            <div className="chart-container">
              <h3>Sipariş Trendleri</h3>
              <Line data={lineChartData} options={chartOptions} />
            </div>
            <div className="chart-container">
              <h3>Gelir Dağılımı</h3>
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        </section>
      </main>

      {isLogoutModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Emin misiniz?</h3>
            <p>Oturumunuz sonlanacaktır.</p>
            <p>
              Kalan Oturum Süresi:{" "}
              <span className="timer">{formatTime(remainingTime)}</span>
            </p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmLogout}>
                Evet, Çıkış Yap
              </button>
              <button className="cancel-btn" onClick={cancelLogout}>
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;