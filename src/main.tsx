import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './providers/authProvider.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './route/AppRouter.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import "./index.css"

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
      <StrictMode>
        <BrowserRouter>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </BrowserRouter>
      </StrictMode>
    </QueryClientProvider>
);