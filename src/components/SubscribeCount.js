import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const SubscribeCount = () => {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const response = await fetch('/api/subscriberCount');
      if (!response.ok) {
        throw new Error('Failed to fetch subscriber count');
      }
      const data = await response.json();
      console.log('Data fetched from API:', data);
      setCount(data.count);
    } catch (error) {
      console.error('Erro ao obter contagem de inscritos:', error);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <Box>
      <Typography variant="h6">Total de Inscritos: {count}</Typography>
    </Box>
  );
};

export default SubscribeCount;
