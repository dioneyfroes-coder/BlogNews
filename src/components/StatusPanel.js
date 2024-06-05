// src/components/StatusPanel.js

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import SubscribeCount from './SubscribeCount';
import styles from '@/styles/admin.module.css';

const StatusPanel = () => {
  return (
    <aside className={styles.statusPanel}>
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
