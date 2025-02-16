import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const ING_URL = `${env.VITE_SPOONACULAR_URL}`;
  const ID_URL = `${env.VITE_SPOONACULAR_ID_SEARCH_URL}`;

  return {
    plugins: [react()],
    server:{
      headers:{
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
        "Cross-Origin-Embedder-Policy": "credentialless",
      },
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: true
        },
        '/spoonacular_ingredient_search' : {
          target: ING_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/spoonacular_ingredient_search/, '')        
        },
        '/spoonacular_id_search': {
          target : ID_URL,
          changeOrigin : true,
          rewrite: (path) => path.replace(/^\/spoonacular_id_search/, ''),
        }
    },
  },
  }
});


