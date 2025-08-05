import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // Fail if 5173 is in use, allowing fallback to next available
    open: true, // Automatically open browser
  },
  optimizeDeps: {
    exclude: ['lucide-react', 'react-router-dom'],
    include: ['react-dom', '@supabase/supabase-js', 'resend'], // Added common dependencies
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
  },
})