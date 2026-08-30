// Ensure window.fetch has a valid setter in sandboxed iframe environments
try {
  const desc = Object.getOwnPropertyDescriptor(window, 'fetch') || Object.getOwnPropertyDescriptor(Window.prototype, 'fetch');
  if (!desc || (!desc.set && desc.get)) {
    const nativeFetch = window.fetch ? window.fetch.bind(window) : undefined;
    let currentFetch = nativeFetch;
    Object.defineProperty(window, 'fetch', {
      get() {
        return currentFetch || (nativeFetch ? nativeFetch : function() { return Promise.reject(new Error('Fetch not available')); });
      },
      set(fn) {
        currentFetch = fn;
      },
      configurable: true,
      enumerable: true,
    });
  }
} catch {
  // Pass safely
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
