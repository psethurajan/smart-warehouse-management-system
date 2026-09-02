import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdWarehouse,
  MdInventory2,
  MdReceiptLong,
  MdInsights,
} from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

const features = [
  { icon: <MdInventory2 />, text: "Track stock across multiple warehouses in real time" },
  { icon: <MdReceiptLong />, text: "Approve purchase orders and auto-update inventory" },
  { icon: <MdInsights />, text: "Get low-stock alerts and movement reports on one dashboard" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left branding panel - hidden on small screens via CSS */}
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <MdWarehouse size={40} />
          <h2>Manage your warehouse from a single dashboard</h2>
          <p>Products, suppliers, purchase orders, and stock movement — all in one place.</p>

          <div className="auth-feature-list">
            {features.map((f, i) => (
              <div className="auth-feature-item" key={i}>
                <span className="feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-logo">
            <Logo />
          </div>
          <p className="auth-subtitle">Sign in to continue to your dashboard</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="demo-accounts">
            <p><strong>Demo accounts</strong></p>
            <p>Admin — admin@swms.com / admin123</p>
            <p>Manager — manager@swms.com / manager123</p>
            <p>Staff — staff@swms.com / staff123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
