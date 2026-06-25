import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { initThemeFromStorage } from './theme-init.js';
import { TezpremiumProvider } from './context/TezpremiumContext';
import { initTelegramWebApp } from './utils/telegramWebApp';
import App from './App.jsx';

initThemeFromStorage();

initTelegramWebApp();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TezpremiumProvider>
      <App />
    </TezpremiumProvider>
  </StrictMode>,
);
