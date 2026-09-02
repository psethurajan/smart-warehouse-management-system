import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// Every protected page is rendered inside this layout so the
// sidebar and topbar stay consistent across the app.
const Layout = ({ title, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} />
      <div className="main-content">
        <Topbar title={title} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
