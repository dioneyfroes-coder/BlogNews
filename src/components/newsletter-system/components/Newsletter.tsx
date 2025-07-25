/**
 * @fileoverview Componente principal da Newsletter
 * @module newsletter/components/Newsletter
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Divider,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Fade
} from '@mui/material';
import {
  Email as EmailIcon,
  Unsubscribe as UnsubscribeIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { SubscribeForm } from './SubscribeForm';
import { UnsubscribeForm } from './UnsubscribeForm';
import { NewsletterStats } from './NewsletterStats';
import { useNewsletter, useNewsletterAnalytics } from '../hooks';
import type { NewsletterProps } from '../types';
import { NEWSLETTER_CONSTANTS } from '../utils';

/**
 * Interface para o estado das abas
 */
interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

/**
 * Componente de painel das abas
 */
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...props }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`newsletter-tabpanel-${index}`}
    aria-labelledby={`newsletter-tab-${index}`}
    {...props}
  >
    {value === index && (
      <Box sx={{ pt: 3 }}>
        {children}
      </Box>
    )}
  </div>
);

/**
 * Componente principal da Newsletter
 * 
 * Gerencia tanto inscrição quanto desinscrição de newsletter,
 * estatísticas e configurações em uma interface unificada.
 */
export const Newsletter: React.FC<NewsletterProps> = ({
  mode = 'both',
  variant = 'default',
  showStats = true,
  autoLoad = true,
  config,
  sx,
  className,
  ...props
}) => {
  // Estados locais
  const [activeTab, setActiveTab] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // Hooks
  const { stats, loadStats } = useNewsletter({
    autoLoadStats: autoLoad && showStats
  });
  const { trackEvent } = useNewsletterAnalytics();

  /**
   * Configuração computada
   */
  const computedConfig = useMemo(() => ({
    validation: NEWSLETTER_CONSTANTS.DEFAULT_VALIDATION,
    messages: NEWSLETTER_CONSTANTS.DEFAULT_MESSAGES,
    cache: { defaultTTL: 300000, enabled: true },
    analytics: { enabled: true },
    ...config
  }), [config]);

  /**
   * Determina quais abas mostrar baseado no modo
   */
  const availableTabs = useMemo(() => {
    const tabs = [];
    
    if (mode === 'subscribe' || mode === 'both') {
      tabs.push({
        label: 'Inscrever',
        icon: <EmailIcon />,
        value: 'subscribe'
      });
    }
    
    if (mode === 'unsubscribe' || mode === 'both') {
      tabs.push({
        label: 'Desinscrever',
        icon: <UnsubscribeIcon />,
        value: 'unsubscribe'
      });
    }
    
    if (showStats) {
      tabs.push({
        label: 'Estatísticas',
        icon: <AnalyticsIcon />,
        value: 'stats'
      });
    }

    return tabs;
  }, [mode, showStats]);

  /**
   * Handler para mudança de aba
   */
  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    trackEvent('tab_change', { 
      tab: availableTabs[newValue]?.value || 'unknown',
      mode 
    });
  }, [availableTabs, mode, trackEvent]);

  /**
   * Handler para sucesso na inscrição
   */
  const handleSubscribeSuccess = useCallback((subscriberData: any) => {
    trackEvent('subscribe_success', { 
      hasName: !!subscriberData.name,
      hasPreferences: !!subscriberData.preferences
    });
    
    // Recarregar estatísticas se estiverem sendo mostradas
    if (showStats) {
      loadStats();
    }
  }, [trackEvent, showStats, loadStats]);

  /**
   * Handler para sucesso na desinscrição
   */
  const handleUnsubscribeSuccess = useCallback((email: string, reason?: string) => {
    trackEvent('unsubscribe_success', { 
      hasReason: !!reason,
      reason: reason ? 'provided' : 'not_provided'
    });
    
    // Recarregar estatísticas se estiverem sendo mostradas
    if (showStats) {
      loadStats();
    }
  }, [trackEvent, showStats, loadStats]);

  /**
   * Handler para erro
   */
  const handleError = useCallback((error: string, type: 'subscribe' | 'unsubscribe') => {
    trackEvent('newsletter_error', { 
      type,
      error: error.substring(0, 100) // Limitar tamanho do erro
    });
  }, [trackEvent]);

  /**
   * Renderiza cabeçalho com informações
   */
  const renderHeader = () => {
    if (variant === 'inline') return null;

    return (
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography 
          variant={variant === 'compact' ? 'h6' : 'h4'} 
          gutterBottom 
          fontWeight="bold"
          sx={{ 
            background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          📧 Newsletter
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Mantenha-se informado com nossas últimas notícias, artigos exclusivos e atualizações importantes.
        </Typography>

        {/* Chip com informações rápidas */}
        {stats && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              size="small"
              icon={<EmailIcon />}
              label={`${stats.totalSubscribers} inscritos`}
              variant="outlined"
            />
            <Chip
              size="small"
              icon={<AnalyticsIcon />}
              label={`${Math.round(stats.growthRate * 100)}% crescimento`}
              variant="outlined"
              color={stats.growthRate > 0 ? 'success' : 'default'}
            />
          </Box>
        )}
      </Box>
    );
  };

  /**
   * Renderiza controles de configuração
   */
  const renderControls = () => {
    if (variant === 'inline') return null;

    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Tooltip title="Informações sobre a newsletter">
          <IconButton size="small">
            <InfoIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Configurações">
          <IconButton 
            size="small"
            onClick={() => setShowSettings(!showSettings)}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  /**
   * Renderiza conteúdo das abas
   */
  const renderTabContent = () => {
    const currentTab = availableTabs[activeTab];
    if (!currentTab) return null;

    switch (currentTab.value) {
      case 'subscribe':
        return (
          <SubscribeForm
            variant={variant}
            showPreferences={variant !== 'inline'}
            allowNameOptional={true}
            categories={['Tecnologia', 'Desenvolvimento', 'Design', 'Negócios']}
            onSuccess={handleSubscribeSuccess}
            onError={(error) => handleError(error, 'subscribe')}
            customValidation={computedConfig.validation}
            sx={{ boxShadow: 'none', background: 'transparent' }}
          />
        );

      case 'unsubscribe':
        return (
          <UnsubscribeForm
            showReasonForm={variant !== 'inline'}
            showConfirmDialog={true}
            allowFeedback={true}
            onSuccess={handleUnsubscribeSuccess}
            onError={(error) => handleError(error, 'unsubscribe')}
            customValidation={computedConfig.validation}
            sx={{ boxShadow: 'none', background: 'transparent' }}
          />
        );

      case 'stats':
        return (
          <NewsletterStats
            stats={stats || undefined}
            autoLoad={autoLoad}
            variant={variant === 'compact' ? 'minimal' : 'card'}
            showCharts={variant !== 'compact'}
          />
        );

      default:
        return null;
    }
  };

  /**
   * Renderiza painel de configurações
   */
  const renderSettings = () => {
    if (!showSettings) return null;

    return (
      <Fade in={showSettings}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Configurações da Newsletter
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Validação:</strong> {(computedConfig.validation as any).allowDisposableEmails ? 'Flexível' : 'Restrita'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Cache:</strong> {computedConfig.cache.enabled ? 'Habilitado' : 'Desabilitado'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Analytics:</strong> {computedConfig.analytics.enabled ? 'Habilitado' : 'Desabilitado'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Modo:</strong> {mode}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>
    );
  };

  // Layout inline simplificado
  if (variant === 'inline') {
    return (
      <Box className={className} sx={{ ...sx }} {...props}>
        {mode === 'subscribe' || mode === 'both' ? (
          <SubscribeForm
            variant="inline"
            onSuccess={handleSubscribeSuccess}
            onError={(error) => handleError(error, 'subscribe')}
            customValidation={computedConfig.validation}
          />
        ) : (
          <UnsubscribeForm
            showReasonForm={false}
            showConfirmDialog={false}
            allowFeedback={false}
            onSuccess={handleUnsubscribeSuccess}
            onError={(error) => handleError(error, 'unsubscribe')}
            customValidation={computedConfig.validation}
          />
        )}
      </Box>
    );
  }

  // Layout padrão com abas
  return (
    <Paper
      className={className}
      sx={{
        p: variant === 'compact' ? 2 : 3,
        maxWidth: variant === 'compact' ? 500 : 700,
        mx: 'auto',
        ...sx
      }}
      {...props}
    >
      {renderControls()}
      {renderHeader()}
      {renderSettings()}

      {/* Abas */}
      {availableTabs.length > 1 && (
        <>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 2 }}
          >
            {availableTabs.map((tab, index) => (
              <Tab
                key={tab.value}
                icon={tab.icon}
                label={tab.label}
                id={`newsletter-tab-${index}`}
                aria-controls={`newsletter-tabpanel-${index}`}
                sx={{ minHeight: 60 }}
              />
            ))}
          </Tabs>
          <Divider sx={{ mb: 2 }} />
        </>
      )}

      {/* Conteúdo das abas */}
      {availableTabs.map((tab, index) => (
        <TabPanel key={tab.value} value={activeTab} index={index}>
          {renderTabContent()}
        </TabPanel>
      ))}
    </Paper>
  );
};
