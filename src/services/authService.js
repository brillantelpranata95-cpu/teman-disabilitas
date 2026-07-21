import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Mapping username to email for Firebase Auth
const ADMIN_EMAIL = 'temon@perisai.com';

export const authService = {
  loginAdmin: async (username, password) => {
    if (username !== 'Temon') {
      throw new Error('Username tidak valid.');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
      return userCredential.user;
    } catch (error) {
      // If user not found, create it (only for the first time setup)
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-login-credentials') {
          try {
             // Attempt to create. If password is wrong and user was created before, it will throw wrong-password.
             // But if invalid-credential occurs, it might be wrong password. 
             // We'll try to create it. If it fails with email-already-in-use, it means wrong password.
             const newUser = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, password);
             return newUser.user;
          } catch(createError) {
              throw new Error('Password salah atau gagal login.');
          }
      }
      throw new Error('Password salah atau gagal login.');
    }
  },
  
  logoutAdmin: async () => {
    await auth.signOut();
  }
};
