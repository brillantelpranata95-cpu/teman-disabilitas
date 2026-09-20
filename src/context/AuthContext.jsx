import { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider, signInWithPopup, signInWithRedirect,
  getRedirectResult, onAuthStateChanged, signOut,
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
    // Selesaikan hasil redirect (jalur cadangan). Kegagalan di sini tidak fatal:
    // jalur utama login memakai popup.
    getRedirectResult(auth).catch((err) => {
      console.warn("getRedirectResult:", err?.code || err?.message);
    });

    return onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setIsSuperAdmin(
        Boolean(u?.email && SUPERADMIN_EMAILS.includes(u.email.toLowerCase()))
      );
    });
  }, []);

  /**
   * Login Google.
   *
   * Popup dipakai sebagai jalur utama: alur redirect menyimpan state di
   * sessionStorage lintas-origin (web.app → firebaseapp.com) yang diblokir
   * browser modern (kebijakan cookie pihak ketiga / storage partitioning),
   * sehingga sesi sering tidak terbentuk dan pengguna terpental kembali ke
   * halaman publik. Redirect hanya dijalankan sebagai cadangan bila popup
   * diblokir atau tidak didukung lingkungan.
   */
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const cred = await signInWithPopup(auth, provider);
      return { ok: true, user: cred?.user ?? null };
    } catch (err) {
      const code = err?.code || "";
      const fallbackable =
        code === "auth/popup-blocked" ||
        code === "auth/operation-not-supported-in-this-environment";

      if (fallbackable) {
        try {
          await signInWithRedirect(auth, provider);
          return { ok: true, redirected: true };
        } catch (err2) {
          return { ok: false, code: err2?.code, message: err2?.message };
        }
      }

      // Pengguna menutup popup sendiri — bukan error yang perlu ditampilkan.
      if (code === "auth/popup-closed-by-user") {
        return { ok: false, code, cancelled: true };
      }

      return { ok: false, code, message: err?.message };
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, isSuperAdmin, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
