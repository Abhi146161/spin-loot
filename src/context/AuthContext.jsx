import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { app } from "../firebase/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const [user, setUser] = useState(null);

  const login = () => {
    signInWithPopup(auth, provider);
  };

  const logout = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  const value = {
    user,
    login,
    logout, // 👈 Added logout function
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
