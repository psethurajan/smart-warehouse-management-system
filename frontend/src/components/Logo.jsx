import { MdWarehouse } from "react-icons/md";

// Small reusable logo used in the sidebar, login page, and splash screen
// so the brand mark stays consistent everywhere.
const Logo = ({ iconOnly = false }) => {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <MdWarehouse />
      {!iconOnly && <span>SWMS</span>}
    </span>
  );
};

export default Logo;
