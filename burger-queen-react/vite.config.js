import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
<<<<<<< Updated upstream
    include: ['**/*.test.jsx'],
    setupFiles: './tests/setup.js',
  },
=======
    setupFiles: './tests/setup.js',
  },

>>>>>>> Stashed changes
})
