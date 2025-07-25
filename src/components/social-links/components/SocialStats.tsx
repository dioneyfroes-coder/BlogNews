/**
 * @fileoverview Componente de estatísticas de links sociais
 * @module social-links/components/SocialStats
 */

'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  Group as GroupIcon,
  Link as LinkIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon
} from '@mui/icons-material';
import { SocialIconResolver, SocialPlatformDetector } from '../utils';
import type { SocialStatsProps, SocialLinkData } from '../types';

/**
 * Componente de estatísticas de links sociais
 * 
 * Exibe métricas e análises dos links sociais configurados.
 */
export const SocialStats: React.FC<SocialStatsProps> = ({
  links,
  variant = 'compact',
  showCharts = false,
  sx,
  ...props
}) => {
  /**
   * Estatísticas processadas
   */
  const stats = useMemo(() => {
    const total = links.length;
    const active = links.filter(link => link.isActive !== false).length;
    const inactive = total - active;
    
    // Contagem por plataforma
    const platformCounts = links.reduce((acc, link) => {
      const platform = link.platform || 'website';
      const platformKey = String(platform);
      acc[platformKey] = (acc[platformKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Plataforma mais usada
    const mostUsedPlatform = Object.entries(platformCounts)
      .sort(([,a], [,b]) => b - a)[0];

    // Porcentagem de links ativos
    const activePercentage = total > 0 ? Math.round((active / total) * 100) : 0;

    return {
      total,
      active,
      inactive,
      activePercentage,
      platformCounts,
      mostUsedPlatform: mostUsedPlatform ? mostUsedPlatform[0] : null,
      mostUsedCount: mostUsedPlatform ? mostUsedPlatform[1] : 0
    };
  }, [links]);

  /**
   * Renderiza estatísticas compactas
   */
  const renderCompactStats = () => (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Chip
        icon={<LinkIcon />}
        label={`${stats.total} links`}
        size="small"
        color="primary"
        variant="outlined"
      />
      
      <Chip
        icon={<ActiveIcon />}
        label={`${stats.active} ativos`}
        size="small"
        color="success"
        variant="outlined"
      />
      
      {stats.inactive > 0 && (
        <Chip
          icon={<InactiveIcon />}
          label={`${stats.inactive} inativos`}
          size="small"
          color="warning"
          variant="outlined"
        />
      )}
    </Box>
  );

  /**
   * Renderiza estatísticas detalhadas
   */
  const renderDetailedStats = () => (
    <Grid container spacing={2}>
      {/* Total de Links */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="primary" fontWeight="bold">
            {stats.total}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total de Links
          </Typography>
        </Paper>
      </Grid>

      {/* Links Ativos */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="success.main" fontWeight="bold">
            {stats.active}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Links Ativos
          </Typography>
          
          <Box sx={{ mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={stats.activePercentage}
              color="success"
              sx={{ height: 6, borderRadius: 3 }}
            />
            <Typography variant="caption" color="text.secondary">
              {stats.activePercentage}% ativo
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* Plataforma Mais Usada */}
      {stats.mostUsedPlatform && (
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              {React.createElement(
                SocialIconResolver.getIcon(stats.mostUsedPlatform as any),
                { fontSize: 'large', color: 'primary' }
              )}
            </Box>
            <Typography variant="h6" fontWeight="bold">
              {stats.mostUsedCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stats.mostUsedPlatform}
            </Typography>
          </Paper>
        </Grid>
      )}

      {/* Distribuição por Plataforma */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Por Plataforma
          </Typography>
          
          <List dense>
            {Object.entries(stats.platformCounts)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 3)
              .map(([platform, count]) => {
                const IconComponent = SocialIconResolver.getIcon(platform as any);
                return (
                  <ListItem key={platform} disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <IconComponent fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={platform}
                      secondary={`${count} link${count > 1 ? 's' : ''}`}
                    />
                  </ListItem>
                );
              })}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  /**
   * Renderiza gráficos (placeholder)
   */
  const renderCharts = () => (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Análise de Plataformas
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {Object.entries(stats.platformCounts).map(([platform, count]) => {
          const IconComponent = SocialIconResolver.getIcon(platform as any);
          const percentage = Math.round((count / stats.total) * 100);
          
          return (
            <Tooltip key={platform} title={`${count} links (${percentage}%)`}>
              <Chip
                icon={<IconComponent />}
                label={`${platform}: ${count}`}
                size="small"
                variant="outlined"
                sx={{ 
                  minWidth: 120,
                  justifyContent: 'flex-start'
                }}
              />
            </Tooltip>
          );
        })}
      </Box>
    </Paper>
  );

  // Renderização condicional baseada na variante
  return (
    <Box sx={sx} {...props}>
      {variant === 'compact' && renderCompactStats()}
      {variant === 'detailed' && renderDetailedStats()}
      {variant === 'chart' && (
        <>
          {renderDetailedStats()}
          {showCharts && renderCharts()}
        </>
      )}
    </Box>
  );
};
