/**
 * @fileoverview Componente de formulário para inscrição na newsletter
 * @module newsletter/components/SubscribeForm
 */

'use client';

import React, { useState, useCallback, type FormEvent } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Collapse,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Fade
} from '@mui/material';
import {
  Email as EmailIcon,
  Person as PersonIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { 
  useNewsletter, 
  useEmailValidation, 
  useSubscriberPreferences,
  useNewsletterForm,
  useNewsletterFeedback,
  useNewsletterAnalytics
} from '../hooks';
import type { SubscribeFormProps, SubscriberData } from '../types';
import { NEWSLETTER_CONSTANTS } from '../utils';

/**
 * Componente de formulário para inscrição na newsletter
 */
export const SubscribeForm: React.FC<SubscribeFormProps> = ({
  variant = 'default',
  showPreferences = false,
  allowNameOptional = true,
  categories = [],
  onSuccess,
  onError,
  customValidation,
  className,
  sx,
  ...props
}) => {
  // Hooks
  const { subscribe, status, message, error } = useNewsletter({
    validationConfig: customValidation,
    onTrackEvent: (event, data) => console.log('Newsletter event:', event, data)
  });

  const { 
    email, 
    validation, 
    validateEmail, 
    clearValidation,
    isValid: isEmailValid 
  } = useEmailValidation(customValidation);

  const {
    preferences,
    updatePreference,
    toggleNotification,
    addCategory,
    removeCategory
  } = useSubscriberPreferences();

  const {
    formData,
    updateName,
    clearFormData
  } = useNewsletterForm();

  const { showSuccess: showFeedbackSuccess, showError: showFeedbackError } = useNewsletterFeedback();
  const { trackFormInteraction } = useNewsletterAnalytics();

  // Estado local
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showSuccessState, setShowSuccessState] = useState(false);

  // Estados derivados
  const isLoading = status === 'loading';
  const hasError = status === 'error';
  const isSuccess = status === 'success';
  const canSubmit = isEmailValid && 
                   acceptTerms && 
                   (!formData.name || formData.name.trim().length > 0) &&
                   !isLoading;

  /**
   * Handler para mudança do email
   */
  const handleEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    validateEmail(value);
    trackFormInteraction('input_change', 'email');
  }, [validateEmail, trackFormInteraction]);

  /**
   * Handler para mudança do nome
   */
  const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    updateName(value);
    trackFormInteraction('input_change', 'name');
  }, [updateName, trackFormInteraction]);

  /**
   * Handler para adicionar categoria
   */
  const handleAddCategory = useCallback((category: string) => {
    addCategory(category);
    trackFormInteraction('category_add', category);
  }, [addCategory, trackFormInteraction]);

  /**
   * Handler para remover categoria
   */
  const handleRemoveCategory = useCallback((category: string) => {
    removeCategory(category);
    trackFormInteraction('category_remove', category);
  }, [removeCategory, trackFormInteraction]);

  /**
   * Handler para submissão do formulário
   */
  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) return;

    trackFormInteraction('form_submit');

    const subscriberData: Omit<SubscriberData, 'subscribedAt' | 'isActive'> = {
      email: email.trim(),
      name: formData.name?.trim() || undefined,
      preferences: showPreferences ? preferences : undefined
    };

    try {
      await subscribe(subscriberData);
      
      if (status === 'success') {
        setShowSuccessState(true);
        onSuccess?.(subscriberData);
        
        // Limpar formulário após sucesso
        setTimeout(() => {
          clearValidation();
          clearFormData();
          setAcceptTerms(false);
          setShowSuccessState(false);
        }, 3000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      onError?.(errorMessage);
    }
  }, [
    canSubmit, 
    email, 
    formData.name, 
    showPreferences, 
    preferences, 
    subscribe, 
    status,
    onSuccess, 
    onError,
    clearValidation,
    clearFormData,
    trackFormInteraction
  ]);

  /**
   * Renderiza campo de email
   */
  const renderEmailField = () => (
    <TextField
      fullWidth
      type="email"
      label="Seu melhor email"
      placeholder="exemplo@email.com"
      value={email}
      onChange={handleEmailChange}
      error={validation.error !== undefined && email.length > 0}
      helperText={
        email.length > 0 
          ? validation.error || validation.suggestion
          : 'Digite seu email para receber nossas novidades'
      }
      disabled={isLoading}
      required
      InputProps={{
        startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
      }}
      sx={{ mb: 2 }}
    />
  );

  /**
   * Renderiza campo de nome
   */
  const renderNameField = () => (
    <TextField
      fullWidth
      type="text"
      label={allowNameOptional ? "Seu nome (opcional)" : "Seu nome"}
      placeholder="Como devemos te chamar?"
      value={formData.name}
      onChange={handleNameChange}
      disabled={isLoading}
      required={!allowNameOptional}
      InputProps={{
        startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
      }}
      sx={{ mb: 2 }}
    />
  );

  /**
   * Renderiza preferências
   */
  const renderPreferences = () => {
    if (!showPreferences) return null;

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Preferências de Newsletter
        </Typography>

        {/* Notificações */}
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={preferences.emailNotifications}
                onChange={() => toggleNotification('emailNotifications')}
                disabled={isLoading}
              />
            }
            label="Receber notificações por email"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={preferences.weeklyDigest}
                onChange={() => toggleNotification('weeklyDigest')}
                disabled={isLoading}
              />
            }
            label="Receber resumo semanal"
          />
        </Box>

        {/* Frequência */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Frequência</InputLabel>
          <Select
            value={preferences.frequency}
            label="Frequência"
            onChange={(e) => updatePreference('frequency', e.target.value as any)}
            disabled={isLoading}
          >
            <MenuItem value="daily">Diário</MenuItem>
            <MenuItem value="weekly">Semanal</MenuItem>
            <MenuItem value="monthly">Mensal</MenuItem>
          </Select>
        </FormControl>

        {/* Categorias */}
        {categories.length > 0 && (
          <Box>
            <Typography variant="body2" gutterBottom>
              Categorias de interesse:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  variant={preferences.categories.includes(category) ? 'filled' : 'outlined'}
                  onClick={() => {
                    if (preferences.categories.includes(category)) {
                      handleRemoveCategory(category);
                    } else {
                      handleAddCategory(category);
                    }
                  }}
                  disabled={isLoading}
                  clickable
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  /**
   * Renderiza checkbox de termos
   */
  const renderTermsCheckbox = () => (
    <FormControlLabel
      control={
        <Checkbox
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          disabled={isLoading}
          required
        />
      }
      label={
        <Typography variant="body2" color="text.secondary">
          Eu aceito receber emails e concordo com os{' '}
          <Typography component="span" color="primary" sx={{ textDecoration: 'underline' }}>
            termos de uso
          </Typography>
        </Typography>
      }
      sx={{ mb: 2 }}
    />
  );

  /**
   * Renderiza botão de submit
   */
  const renderSubmitButton = () => (
    <Button
      type="submit"
      variant="contained"
      size="large"
      fullWidth
      disabled={!canSubmit}
      startIcon={
        isLoading ? (
          <CircularProgress size={20} />
        ) : isSuccess ? (
          <CheckCircleIcon />
        ) : (
          <SendIcon />
        )
      }
      sx={{
        height: 48,
        fontSize: '1.1rem',
        fontWeight: 600,
        background: isSuccess 
          ? 'linear-gradient(45deg, #4caf50, #66bb6a)'
          : 'linear-gradient(45deg, #2196f3, #42a5f5)',
        '&:hover': {
          background: isSuccess
            ? 'linear-gradient(45deg, #388e3c, #4caf50)'
            : 'linear-gradient(45deg, #1976d2, #2196f3)'
        },
        transition: 'all 0.3s ease'
      }}
    >
      {isLoading 
        ? 'Inscrevendo...' 
        : isSuccess 
        ? 'Inscrito com sucesso!' 
        : 'Inscrever na Newsletter'
      }
    </Button>
  );

  /**
   * Renderiza mensagens de feedback
   */
  const renderFeedback = () => (
    <>
      {/* Mensagem de erro */}
      <Collapse in={hasError}>
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => {/* limpar erro */}}
        >
          {error || message}
        </Alert>
      </Collapse>

      {/* Mensagem de sucesso */}
      <Fade in={showSuccessState && isSuccess}>
        <Alert 
          severity="success" 
          sx={{ mb: 2 }}
          icon={<CheckCircleIcon />}
        >
          {message || NEWSLETTER_CONSTANTS.DEFAULT_MESSAGES.SUCCESS.SUBSCRIBE}
        </Alert>
      </Fade>
    </>
  );

  // Variantes de layout
  const getFormContent = () => {
    const content = (
      <>
        {renderFeedback()}
        {renderEmailField()}
        {renderNameField()}
        {renderPreferences()}
        {renderTermsCheckbox()}
        {renderSubmitButton()}
      </>
    );

    if (variant === 'inline') {
      return (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', ...sx }}>
          <Box sx={{ flexGrow: 1 }}>
            {renderEmailField()}
          </Box>
          <Button
            type="submit"
            variant="contained"
            disabled={!canSubmit}
            sx={{ height: 56, minWidth: 120 }}
          >
            {isLoading ? <CircularProgress size={20} /> : 'Inscrever'}
          </Button>
        </Box>
      );
    }

    return content;
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      className={className}
      sx={{
        p: 3,
        maxWidth: variant === 'compact' ? 400 : 500,
        mx: 'auto',
        ...sx
      }}
      {...props}
    >
      {variant !== 'inline' && (
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          📧 Newsletter
        </Typography>
      )}
      
      {variant !== 'inline' && (
        <Typography 
          variant="body1" 
          color="text.secondary" 
          align="center" 
          sx={{ mb: 3 }}
        >
          Fique por dentro das últimas novidades e artigos exclusivos!
        </Typography>
      )}

      {getFormContent()}
    </Paper>
  );
};
