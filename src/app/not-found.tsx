// Configuração para forçar renderização apenas no cliente
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div style={{ 
      textAlign: 'center', 
      marginTop: '4rem',
      padding: '2rem',
      maxWidth: '600px',
      margin: '4rem auto'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: '#333' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>
        Página não encontrada
      </h2>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        A página que você procura não existe.
      </p>
      <a 
        href="/"
        style={{
          display: 'inline-block',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '1rem'
        }}
      >
        Voltar para a Página Inicial
      </a>
    </div>
  );
}
