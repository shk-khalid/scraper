// index.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { store, persistor } from '@/store';
import { AuthProvider } from '@/context/AuthContext';
import App from './App';
import './index.css';
import { MerchantProvider } from './context/MerchantContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <PersistGate loading={<div>Loading persisted state…</div>} persistor={persistor}>
        <Router>
          <AuthProvider>
            <MerchantProvider>
              <App />
            </MerchantProvider>
          </AuthProvider>
        </Router>
      </PersistGate>
    </ReduxProvider>
  </StrictMode>
);
