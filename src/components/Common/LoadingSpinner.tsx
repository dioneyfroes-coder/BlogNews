// src/components/Common/LoadingSpinner.tsx
'use client';

import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Skeleton,
  Card,
  CardContent,
  Stack,
} from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  variant?: 'spinner' | 'skeleton' | 'full-page';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 40, 
  message = 'Carregando...', 
  variant = 'spinner' 
}) => {
  if (variant === 'skeleton') {
    return (
      <Stack spacing={2}>
        {[...Array(3)].map((_, index) => (
          <Card key={index} elevation={0} sx={{ bgcolor: 'transparent' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ ml: 2, flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={20} />
                </Box>
              </Box>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
              <Box sx={{ mt: 2 }}>
                <Skeleton variant="text" height={24} />
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="60%" height={24} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  if (variant === 'full-page') {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          zIndex: 9999,
        }}
      >
        <CircularProgress size={size} thickness={4} />
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 2, fontWeight: 500 }}
        >
          {message}
        </Typography>
      </Box>
    );
  }

  // Default spinner variant
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        minHeight: 200,
      }}
    >
      <CircularProgress size={size} thickness={4} />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, fontWeight: 500 }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
