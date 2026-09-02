// A single stat card used on the dashboard.
// color prop controls the icon background: blue | green | orange | red
const StatCard = ({ icon, label, value, color = "blue" }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;
