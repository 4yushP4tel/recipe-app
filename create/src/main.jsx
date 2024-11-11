import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {Signup} from './pages/signup_page.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Signup/>
  </StrictMode>,
)
