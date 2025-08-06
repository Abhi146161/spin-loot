import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Spinner = () => {
  const { user } = useAuth();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [spinLeft, setSpinLeft] = useState(0);
  const [expired, setExpired] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) return;

      const data = snap.data();
      const start = new Date(data.planStartDate);
      const now = new Date();
      const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays > data.planDays) {
        setExpired(true);
        return;
      }

      const spinsToday = data.dailySpins?.[today] || 0;
      const maxSpin = data.plan === 129 ? 2 : data.plan === 299 ? 3 : 0;
      setSpinLeft(maxSpin - spinsToday);
    };

    fetchData();
  }, [user]);

  const getReward = (day) => {
    const chance = Math.random() * 100;

    if (day === 1) return Math.floor(Math.random() * 3) + 7; // 7-9
    if (day === 2) return Math.floor(Math.random() * 3) + 4; // 4-6
    if (day === 3) return Math.floor(Math.random() * 3) + 3; // 3-5
    if (day === 4 || day === 5)
      return chance < 40 ? 0 : chance < 80 ? 0.2 : Math.floor(Math.random() * 2) + 1; // 0/0.2/1-2
    if (day === 6 || day === 7) return Math.floor(Math.random() * 2) + 6; // 6-7
    if (day <= 14) return Math.floor(Math.random() * 3) + 1; // 1-3
    return [0, 0.2, 1, 2, 3, 4, 5, 7, 9][Math.floor(Math.random() * 9)];
  };

  const handleSpin = async () => {
    if (!user || spinning || spinLeft <= 0 || expired) return;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    const data = snap.data();

    if ((data.wallet || 0) < 1) {
      alert("Not enough balance");
      return;
    }

    setSpinning(true);
    const start = new Date(data.planStartDate);
    const now = new Date();
    const day = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;

    const reward = getReward(day);

    setTimeout(async () => {
      const newWallet = (data.wallet || 0) - 1 + reward;
      const spinsToday = data.dailySpins?.[today] || 0;

      await updateDoc(userRef, {
        wallet: newWallet,
        [`dailySpins.${today}`]: spinsToday + 1,
      });

      setResult(reward);
      setSpinning(false);
      setSpinLeft((prev) => prev - 1);
    }, 2500);
  };

  return (
    <div className="text-center mt-10">
      <motion.div
        animate={{ rotate: spinning ? 1080 : 0 }}
        transition={{ duration: 2.5 }}
        className="w-40 h-40 mx-auto rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl"
      >
        🎯
      </motion.div>

      <button
        onClick={handleSpin}
        disabled={spinning || spinLeft <= 0 || expired}
        className={`mt-6 px-6 py-2 rounded-lg font-bold transition ${
          spinning || spinLeft <= 0 || expired
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-400"
        }`}
      >
        {expired
          ? "Plan Expired"
          : spinLeft <= 0
          ? "No Spins Left Today"
          : "Spin & Win 💸"}
      </button>

      {result !== null && (
        <p className="mt-4 text-xl font-bold text-green-400">
          {result === 0 ? "Better Luck Next Spin!" : `You won ₹${result}`}
        </p>
      )}

      <p className="mt-2 text-sm text-yellow-300">
        Spins Left Today: {spinLeft}
      </p>
    </div>
  );
};

export default Spinner;
