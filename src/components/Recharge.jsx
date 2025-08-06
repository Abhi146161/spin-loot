import React from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebase";

const Recharge = () => {
  const { user } = useAuth();

  const handlePayment = async (amount) => {
    if (!user) return;

    const options = {
      key: "rzp_test_tJYjP5RaMs7mcv",
      amount: amount * 100,
      currency: "INR",
      name: "SpinLoot+",
      description: "Recharge Plan",
      handler: async (response) => {
        const today = new Date();
        const expiry = new Date(today);
        const rechargeData = {
          amount,
          paymentId: response.razorpay_payment_id,
          date: today.toISOString(),
        };

        let spins = 0;
        let days = 0;
        let bonus = 0;

        if (amount === 129) {
          spins = 2;
          days = 28;
          bonus = 5;
        } else if (amount === 299) {
          spins = 3;
          days = 31;
          bonus = 15;
        }

        expiry.setDate(today.getDate() + days);

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            wallet: amount + bonus,
            plan: amount,
            spinsPerDay: spins,
            spinBalance: spins,
            planStart: today.toISOString(),
            planExpiry: expiry.toISOString(),
            rechargeHistory: [rechargeData],
          });
        } else {
          const prev = userSnap.data();
          await updateDoc(userRef, {
            wallet: (prev.wallet || 0) + amount + bonus,
            plan: amount,
            spinsPerDay: spins,
            spinBalance: spins,
            planStart: today.toISOString(),
            planExpiry: expiry.toISOString(),
            rechargeHistory: arrayUnion(rechargeData),
          });
        }

        alert(`Recharge successful! ₹${amount + bonus} added.`);
      },
      prefill: {
        name: user.displayName || "User",
        email: user.email || "example@example.com",
      },
      theme: {
        color: "#facc15",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="text-center mt-8 space-x-4">
      <button
        onClick={() => handlePayment(129)}
        className="bg-yellow-400 hover:bg-yellow-300 px-6 py-3 rounded font-bold"
      >
        Recharge ₹129
      </button>

      <button
        onClick={() => handlePayment(299)}
        className="bg-green-500 hover:bg-green-400 px-6 py-3 rounded font-bold"
      >
        Recharge ₹299
      </button>
    </div>
  );
};

export default Recharge;