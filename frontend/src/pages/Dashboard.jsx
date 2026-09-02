import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  MdInventory2,
  MdWarningAmber,
  MdReceiptLong,
  MdCurrencyRupee,
} from "react-icons/md";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const PIE_COLORS = ["#0d9488", "#f59e0b", "#3b82f6", "#dc2626", "#8b5cf6"];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/dashboard/stats");
      setStats(data);
    } catch (error) {
      console.error("Failed to load dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <Layout title="Dashboard">
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <div className="page-header">
        <div>
          <h2>Welcome back, {user?.name?.split(" ")[0]}</h2>
          <p>{today}</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard
          icon={<MdInventory2 />}
          label="Total Products"
          value={stats.totalProducts}
          color="blue"
        />
        <StatCard
          icon={<MdCurrencyRupee />}
          label="Stock Value"
          value={`₹${stats.totalStockValue.toLocaleString("en-IN")}`}
          color="green"
        />
        <StatCard
          icon={<MdWarningAmber />}
          label="Low Stock Items"
          value={stats.lowStockCount}
          color="orange"
        />
        <StatCard
          icon={<MdReceiptLong />}
          label="Pending Orders"
          value={stats.pendingOrders}
          color="red"
        />
      </div>

      <div className="chart-grid">
        <div className="card">
          <div className="card-header">
            <h3>Stock Movement (Last 6 Months)</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.monthlyMovement}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="stockIn" name="Stock In" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="stockOut" name="Stock Out" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Products by Category</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stats.categoryDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {stats.categoryDistribution.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Low Stock Alerts</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
              </tr>
            </thead>
            <tbody>
              {stats.lowStockProducts.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", color: "#6b7280" }}>
                    All products are sufficiently stocked
                  </td>
                </tr>
              )}
              {stats.lowStockProducts.map((p) => (
                <tr key={p.sku}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.currentStock}</td>
                  <td>{p.reorderLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
