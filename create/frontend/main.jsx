import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {Signup } from './pages/signup_page.jsx';
import { Homepage } from './pages/homepage.jsx';
import { Header } from './components/header.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header/>
    <Signup/>
    <Homepage/>
  </StrictMode>,
)
