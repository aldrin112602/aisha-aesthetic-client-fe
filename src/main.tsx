import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import NotificationProvider from './components/NotificationProvider';
import InstallApp from './components/InstallApp';

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').catch(error => console.error('PWA registration failed:', error));
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider><App /><InstallApp /></NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
