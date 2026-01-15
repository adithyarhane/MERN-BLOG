/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
axios.defaults.withCredentials = true;
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // ---------------------- Register -------------------------------
  const register = async (e, name, email, password) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/register`, {
        name,
        email,
        password,
      });

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
      setIsLoggedIn(true);
      getUserData();
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------- LOGIN --------------------
  const login = async (e, email, password) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
        email,
        password,
      });

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      // ✅ DO NOT fetch user here
      setIsLoggedIn(true);
      getUserData();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------ LOGOUT ------------------------
  const logout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/v1/auth/logout`);
      setIsLoggedIn(false);
      setUserData(null);
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // ----------------- ACCOUNT VERIFICATION -----------------
  const sendVerificationOtp = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/auth/send-verification-otp`
      );

      if (res.data.success) {
        navigate("/verify-account");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const verifyAccount = async (e, otp) => {
    e.preventDefault();
    setIsLoading(true);
    const finalOtp = otp.join("");

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/verify-account`, {
        otp: finalOtp,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setIsLoggedIn(true);
        getUserData();
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------- RESET PASSWORD -------------------
  const sendResetOtp = async (e, email, setIsEmailSent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/send-reset-otp`, {
        email,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setIsEmailSent(true);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (e, email, otp, newPassword) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------- FETCH USER DATA ------------------
  const getUserData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/user/data`);
      if (res.data.success) {
        setUserData(res.data.userData);
      }
    } catch {
      setUserData(null);
    }
  };

  // ---------------- AUTH CHECK (RUNS ONCE) ----------------
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/auth/is-auth`);

        if (res.data.success) {
          setIsLoggedIn(true);
          await getUserData(); // ✅ safe here
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      } catch {
        setIsLoggedIn(false);
        setUserData(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    userData,
    isLoading,
    isAuthLoading,
    login,
    register,
    logout,
    sendVerificationOtp,
    verifyAccount,
    sendResetOtp,
    resetPassword,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
};
