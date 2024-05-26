"use client";

import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import Header from './Header';
import Footer from './Footer';

export default function ClientLayout({ children }) {
  
  return (
    <SessionProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: '1' }}>
          {children}
          <ToastContainer />
        </main>
        <Footer />
      </div>
    </SessionProvider>
  );
};
