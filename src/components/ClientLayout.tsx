"use client";

import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import { useEffect, ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

interface CustomMuiThemeProviderProps {
  children: ReactNode;
}

const CustomMuiThemeProvider: React.FC<CustomMuiThemeProviderProps> = ({ children }) => {
  const { theme } = useTheme();

  const muiTheme = createTheme({
    palette: {
      mode: theme,
    },
  });

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <CustomMuiThemeProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: '1' }}>
              {children}
              <ToastContainer />
            </main>
            <Footer />
          </div>
        </CustomMuiThemeProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};
