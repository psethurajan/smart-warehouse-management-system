import { createContext, useState, useContext } from "react";
import api from "../api/axios";

const AuthContext = createContext();

// Wrap the whole app so any component can access the logged-in user
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });

    const loggedInUser = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    return loggedInUser;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth state anywhere: const { user, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);
