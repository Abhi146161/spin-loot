import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, login, logout } = useAuth();

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
          <div className="flex items-center space-x-4 text-sm">
            <span>👋 {user.displayName?.split(" ")[0]}</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="bg-yellow-500 text-black px-4 py-1 rounded-lg font-semibold hover:bg-yellow-400 transition"
            onClick={login}
          >
            Login
          </button>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
