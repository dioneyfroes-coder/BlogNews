// src/components/StatusPanel.tsx

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import SubscribeCount from './SubscribeCount';
import styles from '@/styles/admin.module.css';

interface StatusPanelProps {
  className?: string;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ className }) => {
  return (
    <aside className={className || styles.statusPanel}>
      <Typography variant="h6" component="h2" className={styles.statusPanelHeader}>
        Status
      </Typography>
      <Box className={styles.statusPanelContent}>
        <SubscribeCount />
        {/* Adicione mais itens de status aqui no futuro */}
      </Box>
    </aside>
  );
};

export default StatusPanel;
