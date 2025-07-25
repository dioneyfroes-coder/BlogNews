"use client";

// Configuração para forçar renderização apenas no cliente
export const dynamic = 'force-dynamic';

export default function ErrorPage() {
  return (
    <main style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <h1 style={{ 
        fontSize: '2rem',
        marginBottom: '16px',
        color: '#333'
      }}>
        Algo está errado!
      </h1>
      <p style={{ 
        fontSize: '1rem',
        color: '#666'
      }}>
        Tente novamente mais tarde.
      </p>
    </main>
  );
};
