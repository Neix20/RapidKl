import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      "@utility": path.resolve(__dirname, "./src/utility/"),
      "@pages":  path.resolve(__dirname, "./src/pages/"),
      "@components":  path.resolve(__dirname, "./src/components/"),
      "@redux":  path.resolve(__dirname, "./src/redux/"),
      "@config":  path.resolve(__dirname, "./src/config/"),
      "@assets":  path.resolve(__dirname, "./src/assets/"),
      "@api":  path.resolve(__dirname, "./src/api/"),
      "@hooks":  path.resolve(__dirname, "./src/hooks/"),
    },
  },
})
