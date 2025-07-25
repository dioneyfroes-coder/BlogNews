import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { emailService } from '@/services';
import { logger } from '@/lib/logger';

const SubscribeCount = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCount = async () => {
    try {
      setLoading(true);
      logger.info('Buscando contagem de inscritos', { component: 'SubscribeCount' });
      
      const stats = await emailService.getEmailStats();
      
      setCount(stats.totalSubscribers);
      logger.info('Contagem de inscritos obtida com sucesso', { 
        count: stats.totalSubscribers 
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao obter contagem de inscritos';
      logger.error('Erro ao obter contagem de inscritos', error as Error);
      console.error('Erro ao obter contagem de inscritos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <Box>
      <Typography variant="h6">
        {loading ? 'Carregando...' : `Total de Inscritos: ${count}`}
      </Typography>
    </Box>
  );
};

export default SubscribeCount;
