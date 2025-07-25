"use client";

import { ToastContainer } from 'react-toastify';
import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import BlogHeader from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import ErrorBoundary from './ErrorBoundary';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { NotificationProvider } from '@/providers/NotificationProvider';
import 'react-toastify/dist/ReactToastify.css';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            bgcolor: 'background.default',
          }}>
          <BlogHeader />
          
          <Box sx={{ 
            display: 'flex', 
            flex: 1, 
            maxWidth: '100vw',
            overflow: 'hidden',
          }}>
            {/* Sidebar fixa apenas no desktop/tablet */}
            <Box sx={{ 
              display: { xs: 'none', md: 'block' },
              width: { md: 280 },
              flexShrink: 0,
            }}>
              <Sidebar />
            </Box>
            
            {/* Área principal de conteúdo */}
            <Box
              component="main"
              sx={{ 
                flex: 1,
                overflow: 'auto',
                p: { xs: 2, sm: 3 },
                width: { xs: '100%', md: 'calc(100% - 280px)' },
              }}
            >
              <Container maxWidth="lg" disableGutters>
                {children}
              </Container>
            </Box>
          </Box>
          
          {/* Sidebar horizontal no mobile (acima do footer) */}
          <Box sx={{ 
            display: { xs: 'block', md: 'none' },
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}>
            <Sidebar />
          </Box>
          
          <Footer />
        </Box>
        
        <ToastContainer 
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
