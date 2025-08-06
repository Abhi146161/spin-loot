import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const WithdrawHistory = () => {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "withdrawals"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWithdrawals(data);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-gray-900 rounded-xl border border-yellow-500 shadow-lg">
      <h2 className="text-xl font-bold text-yellow-400 mb-4 text-center">Withdraw History 📜</h2>
      {withdrawals.length === 0 ? (
        <p className="text-center text-gray-400">No withdraw history yet.</p>
      ) : (
        <ul className="space-y-3">
          {withdrawals.map((item) => (
            <li
              key={item.id}
              className="bg-gray-800 p-3 rounded-lg border border-gray-700"
            >
              <p className="text-white">
                💰 <span className="font-bold">₹{item.amount}</span> to{" "}
                <span className="text-yellow-400">{item.upi}</span>
              </p>
              <p className="text-sm text-gray-400">
                Status:{" "}
                <span
                  className={`${
                    item.status === "pending"
                      ? "text-yellow-400"
                      : item.status === "completed"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {item.status}
                </span>{" "}
                | {new Date(item.timestamp?.toDate()).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WithdrawHistory;
