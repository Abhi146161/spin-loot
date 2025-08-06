import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Wallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(0);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setWallet(data.wallet || 0);
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-24 mb-6 text-center"
    >
      <motion.div
        whileHover={{ scale: 1.03 }}
        className="inline-block bg-gradient-to-tr from-gray-900 via-black to-gray-800 px-8 py-4 rounded-3xl shadow-2xl border-2 border-yellow-400"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
          Wallet Balance:{" "}
          <motion.span
            key={wallet}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-green-400 drop-shadow-lg"
          >
            ₹{wallet}
          </motion.span>
        </h2>
      </motion.div>
    </motion.div>
  );
};

export default Wallet;
