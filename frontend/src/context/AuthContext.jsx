import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { socket } from "../utils/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("eos_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
        connectSocket(res.data.user);
      })
      .catch(() => localStorage.removeItem("eos_token"))
      .finally(() => setLoading(false));
  }, []);

  const connectSocket = (user) => {
    socket.connect();
    // Rooms let the backend target real-time events to the right audience:
    // every placement_admin dashboard, or a specific student.
    socket.emit("join", user.role);
    if (user.role === "student") socket.emit("join", `student:${user.id}`);
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("eos_token", res.data.token);
    setUser(res.data.user);
    connectSocket(res.data.user);
    return res.data.user;
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    localStorage.setItem("eos_token", res.data.token);
    setUser(res.data.user);
    connectSocket(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("eos_token");
    socket.disconnect();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
