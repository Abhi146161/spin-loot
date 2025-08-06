import React from "react";
import Navbar from "./components/Navbar";
import Wallet from "./components/Wallet";
import Recharge from "./components/Recharge";
import Spinner from "./components/Spinner";
import Withdraw from "./components/Withdraw";
import WithdrawHistory from "./components/WithdrawHistory";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, login } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">
          Welcome to SpinLoot+
        </h1>
        <button
          onClick={login}
          className="bg-yellow-500 hover:bg-yellow-400 px-6 py-2 rounded-xl font-bold text-black"
        >
          Login to Continue
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <Navbar />
      <Wallet />
      <Recharge />
      <Spinner />
      <Withdraw />
      <WithdrawHistory />
    </div>
  );
}

export default App;
