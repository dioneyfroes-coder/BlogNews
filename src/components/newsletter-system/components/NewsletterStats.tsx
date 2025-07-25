/**
 * @fileoverview Componente para exibir estatísticas da newsletter
 * @module newsletter/components/NewsletterStats
 */

'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Skeleton,
  Alert,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Email as EmailIcon,
  Analytics as AnalyticsIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useNewsletter } from '../hooks';
import type { NewsletterStatsProps, NewsletterStats as StatsData } from '../types';

/**
 * Utilitário para formatar números
 */
const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

/**
 * Utilitário para formatar porcentagem
 */
const formatPercentage = (decimal: number): string => {
  return `${(decimal * 100).toFixed(1)}%`;
};

/**
 * Interface para item de estatística
 */
interface StatItemProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  variant?: 'card' | 'inline';
}

/**
 * Componente para item individual de estatística
 */
const StatItem: React.FC<StatItemProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
  variant = 'card'
}) => {
  const trendIcon = trend !== undefined ? (
    trend > 0 ? (
      <TrendingUpIcon color="success" fontSize="small" />
    ) : trend < 0 ? (
      <TrendingDownIcon color="error" fontSize="small" />
    ) : null
  ) : null;

  const content = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ mr: 1, color: `${color}.main` }}>
          {icon}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
      
      <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
        {typeof value === 'number' ? formatNumber(value) : value}
      </Typography>
      
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
      
      {trend !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {trendIcon}
          <Typography
            variant="body2"
            color={trend > 0 ? 'success.main' : trend < 0 ? 'error.main' : 'text.secondary'}
            sx={{ ml: 0.5 }}
          >
            {trend > 0 ? '+' : ''}{formatPercentage(Math.abs(trend))}
          </Typography>
        </Box>
      )}
    </>
  );

  if (variant === 'inline') {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        {content}
      </Box>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ textAlign: 'center' }}>
        {content}
      </CardContent>
    </Card>
  );
};

/**
 * Componente de progresso para métricas
 */
interface ProgressMetricProps {
  label: string;
  value: number;
  max: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const ProgressMetric: React.FC<ProgressMetricProps> = ({
  label,
  value,
  max,
  color = 'primary'
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          {formatNumber(value)} / {formatNumber(max)}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        color={color}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
};

/**
 * Componente principal para estatísticas da newsletter
 */
export const NewsletterStats: React.FC<NewsletterStatsProps> = ({
  stats: externalStats,
  autoLoad = true,
  variant = 'card',
  showCharts = true,
  sx
}) => {
  // Hook para carregar dados se não fornecidos externamente
  const { stats: hookStats, status, loadStats } = useNewsletter({
    autoLoadStats: autoLoad && !externalStats
  });

  // Usar stats externos ou do hook
  const stats = externalStats || hookStats;
  const isLoading = status === 'loading' && !stats;
  const hasError = status === 'error' && !stats;

  /**
   * Dados computados para exibição
   */
  const computedStats = useMemo(() => {
    if (!stats) return null;

    return {
      // Estatísticas principais
      totalSubscribers: stats.totalSubscribers,
      weeklySubscribers: stats.weeklySubscribers,
      monthlySubscribers: stats.monthlySubscribers,
      growthRate: stats.growthRate,
      unsubscribeRate: stats.unsubscribeRate,

      // Métricas derivadas
      retentionRate: 1 - stats.unsubscribeRate,
      averageWeeklyGrowth: stats.weeklySubscribers / 4, // Aproximação diária
      
      // Projeções
      projectedMonthly: Math.round(stats.weeklySubscribers * 4.33),
      projectedYearly: Math.round(stats.monthlySubscribers * 12)
    };
  }, [stats]);

  /**
   * Renderiza skeleton durante carregamento
   */
  const renderSkeleton = () => (
    <Grid container spacing={2}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item}>
          <Card>
            <CardContent>
              <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
              <Skeleton variant="text" width="40%" height={40} />
              <Skeleton variant="text" width="80%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  /**
   * Renderiza mensagem de erro
   */
  const renderError = () => (
    <Alert 
      severity="error" 
      action={
        <Typography 
          variant="body2" 
          color="primary" 
          sx={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={loadStats}
        >
          Tentar novamente
        </Typography>
      }
    >
      Erro ao carregar estatísticas da newsletter
    </Alert>
  );

  /**
   * Renderiza estatísticas principais
   */
  const renderMainStats = () => {
    if (!computedStats) return null;

    const mainStatsData = [
      {
        title: 'Total de Inscritos',
        value: computedStats.totalSubscribers,
        icon: <PeopleIcon />,
        color: 'primary' as const,
        trend: computedStats.growthRate
      },
      {
        title: 'Novos esta Semana',
        value: computedStats.weeklySubscribers,
        icon: <EmailIcon />,
        color: 'success' as const,
        subtitle: `${formatNumber(computedStats.averageWeeklyGrowth)}/dia em média`
      },
      {
        title: 'Novos este Mês',
        value: computedStats.monthlySubscribers,
        icon: <ScheduleIcon />,
        color: 'secondary' as const,
        subtitle: `Projeção: ${formatNumber(computedStats.projectedMonthly)}`
      },
      {
        title: 'Taxa de Retenção',
        value: formatPercentage(computedStats.retentionRate),
        icon: <AnalyticsIcon />,
        color: computedStats.retentionRate > 0.95 ? 'success' as const : 'warning' as const,
        trend: -computedStats.unsubscribeRate
      }
    ];

    return (
      <Grid container spacing={2}>
        {mainStatsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatItem
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
              variant={variant === 'minimal' ? 'inline' : 'card'}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  /**
   * Renderiza métricas detalhadas
   */
  const renderDetailedMetrics = () => {
    if (!computedStats || !showCharts || variant === 'minimal') return null;

    return (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Métricas Detalhadas
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ProgressMetric
                label="Meta Mensal de Crescimento"
                value={computedStats.monthlySubscribers}
                max={computedStats.projectedMonthly}
                color="primary"
              />
              
              <ProgressMetric
                label="Taxa de Retenção"
                value={computedStats.retentionRate * 100}
                max={100}
                color="success"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Projeções
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Crescimento Anual Projetado:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatNumber(computedStats.projectedYearly)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Taxa de Crescimento:
                  </Typography>
                  <Chip
                    size="small"
                    label={formatPercentage(computedStats.growthRate)}
                    color={computedStats.growthRate > 0 ? 'success' : 'default'}
                    icon={computedStats.growthRate > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  /**
   * Renderiza informações resumidas
   */
  const renderSummary = () => {
    if (!computedStats || variant !== 'minimal') return null;

    return (
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {formatNumber(computedStats.totalSubscribers)} inscritos • 
          {formatPercentage(computedStats.retentionRate)} retenção • 
          {formatNumber(computedStats.weeklySubscribers)} novos/semana
        </Typography>
      </Box>
    );
  };

  // Estados de loading e erro
  if (isLoading) return renderSkeleton();
  if (hasError) return renderError();
  if (!stats) return null;

  return (
    <Box sx={{ ...sx }}>
      {variant !== 'minimal' && (
        <Typography variant="h5" gutterBottom fontWeight="bold">
          📊 Estatísticas da Newsletter
        </Typography>
      )}
      
      {renderMainStats()}
      {renderDetailedMetrics()}
      {renderSummary()}
    </Box>
  );
};
