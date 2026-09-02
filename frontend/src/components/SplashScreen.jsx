import { MdWarehouse } from "react-icons/md";

// Shown for a couple of seconds when the app first loads (see App.jsx).
// Keeps the branding simple: icon + name + a tiny bouncing-dots loader,
// no heavy animation library needed.
const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <div className="splash-logo-circle">
        <MdWarehouse />
      </div>
      <div className="splash-title">SWMS</div>
      <div className="splash-subtitle">Smart Warehouse Management System</div>
      <div className="splash-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default SplashScreen;
