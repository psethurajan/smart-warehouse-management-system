import { NavLink } from "react-router-dom";
import {
  MdSpaceDashboard,
  MdInventory2,
  MdCategory,
  MdLocalShipping,
  MdWarehouse,
  MdReceiptLong,
  MdSwapHoriz,
  MdPeople,
} from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

// Each link can restrict itself to certain roles using "roles: []"
const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: <MdSpaceDashboard />, roles: ["admin", "manager", "staff"] },
  { to: "/products", label: "Products", icon: <MdInventory2 />, roles: ["admin", "manager", "staff"] },
  { to: "/categories", label: "Categories", icon: <MdCategory />, roles: ["admin", "manager"] },
  { to: "/suppliers", label: "Suppliers", icon: <MdLocalShipping />, roles: ["admin", "manager"] },
  { to: "/warehouses", label: "Warehouses", icon: <MdWarehouse />, roles: ["admin"] },
  { to: "/purchase-orders", label: "Purchase Orders", icon: <MdReceiptLong />, roles: ["admin", "manager"] },
  { to: "/transactions", label: "Stock Transactions", icon: <MdSwapHoriz />, roles: ["admin", "manager", "staff"] },
  { to: "/employees", label: "Employees", icon: <MdPeople />, roles: ["admin"] },
];

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-logo">
        <Logo />
      </div>
      <nav className="sidebar-nav">
        {navItems
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
