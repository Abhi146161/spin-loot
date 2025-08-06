import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const Withdraw = () => {
  const { user } = useAuth();
  const [upi, setUpi] = useState("");
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState(0);
  const [withdraws, setWithdraws] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setWallet(data.wallet || 0);
        setWithdraws(data.withdrawHistory || []);
      }
    };
    fetchData();
  }, [user]);

  const getRequiredWithdrawAmount = () => {
    const count = withdraws.length;
    if (count === 0) return 30;
    if (count === 1) return 40;
    return 110;
  };

  const hasUserPlayedSinceRecharge = (data) => {
    const today = new Date().toISOString().split("T")[0];
    const lastRecharge = data.lastRecharge;
    if (!lastRecharge) return false;

    const spinDates = Object.keys(data.dailySpins || {});
    return spinDates.some((date) => date >= lastRecharge);
  };

  const handleWithdraw = async () => {
    if (!upi || !amount || isNaN(amount)) return alert("Fill all fields");

    const amt = parseFloat(amount);
    const requiredAmt = getRequiredWithdrawAmount();

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    const data = snap.data();

    const hasPlayed = hasUserPlayedSinceRecharge(data);

    if (!hasPlayed)
      return alert("Please spin after recharge before withdrawing.");

    // ✅ Strict withdraw rule enforcement
    if (withdraws.length < 2 && amt !== requiredAmt) {
      return alert(`You must withdraw exactly ₹${requiredAmt} at this stage.`);
    }

    if (withdraws.length >= 2 && amt < requiredAmt) {
      return alert(`Minimum withdraw for 3rd+ time is ₹${requiredAmt}`);
    }

    if ((data.wallet || 0) < amt) return alert("Not enough balance");

    const newRequest = {
      amount: amt,
      upi,
      date: new Date().toISOString(),
      status: "pending",
    };

    await updateDoc(userRef, {
      wallet: data.wallet - amt,
      withdrawHistory: arrayUnion(newRequest),
    });

    alert("Withdraw request submitted!");
    setAmount("");
    setUpi("");
  };

  return (
    <div className="max-w-md mx-auto p-4 text-white mt-8">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">Withdraw</h2>

      <input
        type="text"
        value={upi}
        onChange={(e) => setUpi(e.target.value)}
        placeholder="Enter UPI ID"
        className="w-full mb-3 px-4 py-2 rounded bg-gray-800 text-white border border-yellow-400"
      />

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder={`Withdraw ₹${getRequiredWithdrawAmount()} or more`}
        className="w-full mb-3 px-4 py-2 rounded bg-gray-800 text-white border border-yellow-400"
      />

      <button
        onClick={handleWithdraw}
        className="w-full bg-green-500 hover:bg-green-400 py-2 rounded font-bold text-black"
      >
        Request Withdraw
      </button>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-yellow-300">Withdraw History</h3>
        <ul className="space-y-2 mt-2">
          {withdraws.length === 0 && <li>No withdraws yet.</li>}
          {withdraws.map((w, idx) => (
            <li
              key={idx}
              className={`border p-2 rounded ${
                w.status === "completed"
                  ? "border-green-500"
                  : w.status === "rejected"
                  ? "border-red-500"
                  : "border-yellow-400"
              }`}
            >
              ₹{w.amount} - {w.upi} - <span className="capitalize">{w.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Withdraw;
