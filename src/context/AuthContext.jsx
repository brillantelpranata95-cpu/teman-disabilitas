import { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider, signInWithRedirect, getRedirectResult,
  onAuthStateChanged, signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";

/** Email superadmin — samakan dengan daftar di firestore.rules */
export const SUPERADMIN_EMAILS = [
  "temonkec@gmail.com",
  "brillantelpranata95@gmail.com",
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = masih memuat
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    getRedirectResult(auth).catch(console.error);
    return onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setIsSuperAdmin(
        Boolean(u?.email && SUPERADMIN_EMAILS.includes(u.email.toLowerCase()))
      );
    });
  }, []);

  const loginWithGoogle = () => signInWithRedirect(auth, new GoogleAuthProvider());
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, isSuperAdmin, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
