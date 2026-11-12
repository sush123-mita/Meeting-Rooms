import { createContext, useContext, useState } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../services/authServices";

const AuthContext = createContext(null);

// Temporary UI-only admin identification.
// Replace this with a server-provided role when the backend supports it.
const ADMIN_USERNAME = "sushmita";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("meetspace_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);

    try {
      await loginUser(credentials);

      const currentUser = {
        username: credentials.username,
        role:
          credentials.username.toLowerCase() === ADMIN_USERNAME
            ? "admin"
            : "employee",
      };

      localStorage.setItem(
        "meetspace_user",
        JSON.stringify(currentUser)
      );

      setUser(currentUser);
      return currentUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    return await registerUser(userData);
  };

  const logout = () => {
    logoutUser();
    localStorage.removeItem("meetspace_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);