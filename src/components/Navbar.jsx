// ✅ UPDATED Navbar.jsx
import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-black text-white shadow-xl fixed top-0 left-0 w-full z-50"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-400">SpinLoot+</h1>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">👋 {user.displayName?.split(" ")[0]}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400"
            >
              Logout
            </button>
          </div>
        ) : (
          <div id="google-signin-button" className="ml-auto"></div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
