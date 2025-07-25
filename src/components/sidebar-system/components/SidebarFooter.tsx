/**
 * @fileoverview Componente de Footer da Sidebar
 * @module sidebar/components/SidebarFooter
 */

'use client';

import React from 'react';
import {
  Box,
  Typography,
  Divider,
  useTheme,
  alpha
} from '@mui/material';

import type { SidebarFooterProps } from '../types';

/**
 * Componente de Footer da Sidebar
 */
export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  children,
  compact = false,
  showDivider = true,
  sx,
  ...props
}) => {
  const theme = useTheme();

  if (compact) {
    return (
      <Box
        sx={{
          p: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ...sx
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }

  return (
    <>
      {showDivider && <Divider />}
      <Box
        sx={{
          p: 2,
          mt: 'auto',
          backgroundColor: alpha(theme.palette.background.default, 0.5),
          ...sx
        }}
        {...props}
      >
        {children}
      </Box>
    </>
  );
};
