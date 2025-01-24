import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const URL = `${env.VITE_SPOONACULAR_URL}`;
  const KEY = `${env.VITE_SPOONACULAR_API_KEY}`;
  const FULL_URL = `${URL}?apiKey=${KEY}&`

  return {
    plugins: [react()],
    server:{
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: true
        },
        '/spoonacular' : {
          target: URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/spoonacular/, '')        

        }
    },
  },
  }
});


