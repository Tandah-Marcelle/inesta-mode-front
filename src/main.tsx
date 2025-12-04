import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ShopProvider } from './contexts/ShopContext.tsx';
import { ChatbotProvider } from './contexts/ChatbotContext.tsx';
import { CategoriesProvider } from './contexts/CategoriesContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { PermissionsProvider } from './contexts/PermissionsContext.tsx';
import './index.css';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <PermissionsProvider>
          <CategoriesProvider>
            <ShopProvider>
              <ChatbotProvider>
                <App />
              </ChatbotProvider>
            </ShopProvider>
          </CategoriesProvider>
        </PermissionsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
