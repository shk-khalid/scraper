
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';

function App() {
  return (
    <>
      <AppRoutes />

      <Toaster
        position="bottom-left"
        toastOptions={{
          // base styles for all toasts (this will act as your "info" style)
          style: {
            background: '#DBEAFE',   
            color: '#1E40AF',      
            borderRadius: '8px',
            padding: '14px 20px',
            fontWeight: 500,
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          },
          iconTheme: {
            primary: '#3B82F6',       // Tailwind blue-500
            secondary: '#DBEAFE',
          },

          // success toasts
          success: {
            style: {
              background: '#DCFCE7',  // Tailwind green-200
              color: '#166534',       // Tailwind green-800
            },
            iconTheme: {
              primary: '#16A34A',     // Tailwind green-600
              secondary: '#DCFCE7',
            },
          },

          // error toasts
          error: {
            style: {
              background: '#FECACA',  // Tailwind red-200
              color: '#991B1B',       // Tailwind red-800
            },
            iconTheme: {
              primary: '#DC2626',     // Tailwind red-600
              secondary: '#FECACA',
            },
          },
        }}
      />
    </>
  );
}

export default App;
