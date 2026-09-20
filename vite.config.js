import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// PERISAI Temon — Vite config
// Code-splitting: react & firebase dipisah agar cache jangka panjang efisien.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore", "firebase/analytics"],
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
});
