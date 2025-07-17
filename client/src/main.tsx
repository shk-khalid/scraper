import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { store, persistor } from '@/store';
import { AuthProvider } from '@/context/AuthContext';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root')!;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID!;

createRoot(rootElement).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <ReduxProvider store={store}>
      <PersistGate loading={<div>Loading... </div>} persistor={persistor}>
        <Router>
          <AuthProvider>
            <App />
          </AuthProvider>
        </Router>
      </PersistGate>
    </ReduxProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
