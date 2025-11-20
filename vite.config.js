import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    port: 3000,      // Changes the port to 3000
    strictPort: true, // Optional: Fails if 3000 is already in use (instead of switching to 3001)
  }
})
