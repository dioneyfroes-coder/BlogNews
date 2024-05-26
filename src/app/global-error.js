'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function GlobalError({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div>
      <h1>Algo está errado!</h1>
      <button onClick={() => router.push('/')}>Ir para Home</button>
    </div>
  );
};
