/**
 * @fileoverview Componente para desinscrição da newsletter
 * @module newsletter/components/UnsubscribeForm
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextareaAutosize,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade
} from '@mui/material';
import {
  Email as EmailIcon,
  Unsubscribe as UnsubscribeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Feedback as FeedbackIcon
} from '@mui/icons-material';
import { 
  useNewsletter, 
  useEmailValidation,
  useNewsletterFeedback,
  useNewsletterAnalytics
} from '../hooks';
import type { UnsubscribeFormProps } from '../types';
import { NEWSLETTER_CONSTANTS } from '../utils';

/**
 * Opções de motivos para desinscrição
 */
const UNSUBSCRIBE_REASONS = [
  { value: 'too_frequent', label: 'Muitos emails' },
  { value: 'not_relevant', label: 'Conteúdo não é relevante' },
  { value: 'never_signed_up', label: 'Nunca me inscrevi' },
  { value: 'temporary', label: 'Pausa temporária' },
  { value: 'technical_issues', label: 'Problemas técnicos' },
  { value: 'privacy_concerns', label: 'Preocupações com privacidade' },
  { value: 'other', label: 'Outro motivo' }
] as const;

type UnsubscribeReason = typeof UNSUBSCRIBE_REASONS[number]['value'];

/**
 * Componente de formulário para desinscrição da newsletter
 */
export const UnsubscribeForm: React.FC<UnsubscribeFormProps> = ({
  initialEmail,
  showReasonForm = true,
  showConfirmDialog = true,
  allowFeedback = true,
  onSuccess,
  onError,
  onCancel,
  customValidation,
  className,
  sx,
  ...props
}) => {
  // Hooks
  const { unsubscribe, status, message, error } = useNewsletter({
    validationConfig: customValidation
  });

  const { 
    email, 
    validation, 
    validateEmail, 
    clearValidation,
    isValid: isEmailValid 
  } = useEmailValidation(customValidation);

  const { showSuccess, showError } = useNewsletterFeedback();
  const { trackFormInteraction } = useNewsletterAnalytics();

  // Estados locais
  const [selectedReason, setSelectedReason] = useState<UnsubscribeReason | ''>('');
  const [customReason, setCustomReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Estados derivados
  const isLoading = status === 'loading';
  const hasError = status === 'error';
  const isSuccess = status === 'success';
  const canSubmit = isEmailValid && 
                   (!showReasonForm || selectedReason !== '') && 
                   !isLoading;

  // Definir email inicial se fornecido
  React.useEffect(() => {
    if (initialEmail && !email) {
      validateEmail(initialEmail);
    }
  }, [initialEmail, email, validateEmail]);

  /**
   * Handler para mudança do email
   */
  const handleEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    validateEmail(value);
    trackFormInteraction('input_change', 'email');
  }, [validateEmail, trackFormInteraction]);

  /**
   * Handler para mudança do motivo
   */
  const handleReasonChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as UnsubscribeReason;
    setSelectedReason(value);
    trackFormInteraction('reason_select', value);
  }, [trackFormInteraction]);

  /**
   * Handler para mudança do motivo customizado
   */
  const handleCustomReasonChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomReason(event.target.value);
  }, []);

  /**
   * Handler para mudança do feedback
   */
  const handleFeedbackChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(event.target.value);
  }, []);

  /**
   * Handler para confirmar desinscrição
   */
  const handleConfirmUnsubscribe = useCallback(async () => {
    if (!canSubmit) return;

    setShowConfirm(false);
    trackFormInteraction('confirm_unsubscribe');

    const reasonText = selectedReason === 'other' 
      ? customReason 
      : UNSUBSCRIBE_REASONS.find(r => r.value === selectedReason)?.label || '';

    const fullReason = allowFeedback && feedback 
      ? `${reasonText}. Feedback: ${feedback}`
      : reasonText;

    try {
      await unsubscribe(email.trim(), fullReason);
      
      if (status === 'success') {
        setIsCompleted(true);
        onSuccess?.(email.trim(), fullReason);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      onError?.(errorMessage);
    }
  }, [
    canSubmit,
    selectedReason,
    customReason,
    allowFeedback,
    feedback,
    email,
    unsubscribe,
    status,
    onSuccess,
    onError,
    trackFormInteraction
  ]);

  /**
   * Handler para submissão do formulário
   */
  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) return;

    if (showConfirmDialog) {
      setShowConfirm(true);
    } else {
      await handleConfirmUnsubscribe();
    }
  }, [canSubmit, showConfirmDialog, handleConfirmUnsubscribe]);

  /**
   * Handler para cancelar
   */
  const handleCancel = useCallback(() => {
    trackFormInteraction('cancel_unsubscribe');
    clearValidation();
    setSelectedReason('');
    setCustomReason('');
    setFeedback('');
    onCancel?.();
  }, [trackFormInteraction, clearValidation, onCancel]);

  /**
   * Renderiza campo de email
   */
  const renderEmailField = () => (
    <TextField
      fullWidth
      type="email"
      label="Email para desinscrever"
      placeholder="exemplo@email.com"
      value={email}
      onChange={handleEmailChange}
      error={validation.error !== undefined && email.length > 0}
      helperText={
        email.length > 0 
          ? validation.error
          : 'Digite o email que deseja desinscrever'
      }
      disabled={isLoading || !!initialEmail}
      required
      InputProps={{
        startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
      }}
      sx={{ mb: 3 }}
    />
  );

  /**
   * Renderiza formulário de motivo
   */
  const renderReasonForm = () => {
    if (!showReasonForm) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Por que você está se desinscrevendo? (opcional)
        </Typography>
        
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={selectedReason}
            onChange={handleReasonChange}
          >
            {UNSUBSCRIBE_REASONS.map((reason) => (
              <FormControlLabel
                key={reason.value}
                value={reason.value}
                control={<Radio />}
                label={reason.label}
                disabled={isLoading}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {/* Campo customizado para "Outro motivo" */}
        {selectedReason === 'other' && (
          <Box sx={{ mt: 2 }}>
            <TextareaAutosize
              minRows={3}
              placeholder="Por favor, descreva o motivo..."
              value={customReason}
              onChange={handleCustomReasonChange}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontFamily: 'inherit',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </Box>
        )}
      </Box>
    );
  };

  /**
   * Renderiza campo de feedback
   */
  const renderFeedbackField = () => {
    if (!allowFeedback) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <FeedbackIcon sx={{ mr: 1 }} />
          Feedback adicional (opcional)
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Suas sugestões nos ajudam a melhorar nosso serviço
        </Typography>
        <TextareaAutosize
          minRows={3}
          placeholder="Compartilhe suas sugestões ou comentários..."
          value={feedback}
          onChange={handleFeedbackChange}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontFamily: 'inherit',
            fontSize: '14px',
            resize: 'vertical'
          }}
        />
      </Box>
    );
  };

  /**
   * Renderiza botões de ação
   */
  const renderActionButtons = () => (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
      {onCancel && (
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={isLoading}
          sx={{ minWidth: 120 }}
        >
          Cancelar
        </Button>
      )}
      
      <Button
        type="submit"
        variant="contained"
        color="error"
        disabled={!canSubmit}
        startIcon={
          isLoading ? (
            <CircularProgress size={20} />
          ) : isSuccess ? (
            <CheckCircleIcon />
          ) : (
            <UnsubscribeIcon />
          )
        }
        sx={{ 
          minWidth: 200,
          flexGrow: onCancel ? 0 : 1
        }}
      >
        {isLoading 
          ? 'Desinscrevendo...' 
          : isSuccess 
          ? 'Desinscrição realizada!' 
          : 'Confirmar Desinscrição'
        }
      </Button>
    </Box>
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
        >
          {error || message}
        </Alert>
      </Collapse>

      {/* Mensagem de sucesso */}
      <Fade in={isCompleted && isSuccess}>
        <Alert 
          severity="success" 
          sx={{ mb: 2 }}
          icon={<CheckCircleIcon />}
        >
          {message || NEWSLETTER_CONSTANTS.DEFAULT_MESSAGES.SUCCESS.UNSUBSCRIBE}
        </Alert>
      </Fade>
    </>
  );

  /**
   * Renderiza dialog de confirmação
   */
  const renderConfirmDialog = () => (
    <Dialog
      open={showConfirm}
      onClose={() => setShowConfirm(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <WarningIcon color="warning" sx={{ mr: 1 }} />
        Confirmar Desinscrição
      </DialogTitle>
      
      <DialogContent>
        <Typography gutterBottom>
          Tem certeza que deseja se desinscrever da nossa newsletter?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Email:</strong> {email}
        </Typography>
        {selectedReason && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <strong>Motivo:</strong> {
              selectedReason === 'other' 
                ? customReason 
                : UNSUBSCRIBE_REASONS.find(r => r.value === selectedReason)?.label
            }
          </Typography>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={() => setShowConfirm(false)}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirmUnsubscribe}
          variant="contained"
          color="error"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <UnsubscribeIcon />}
        >
          {isLoading ? 'Desinscrevendo...' : 'Sim, Desinscrever'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Se já foi completado, mostrar apenas mensagem de sucesso
  if (isCompleted && isSuccess) {
    return (
      <Paper
        className={className}
        sx={{
          p: 4,
          maxWidth: 500,
          mx: 'auto',
          textAlign: 'center',
          ...sx
        }}
        {...props}
      >
        <CheckCircleIcon 
          color="success" 
          sx={{ fontSize: 64, mb: 2 }} 
        />
        <Typography variant="h5" gutterBottom color="success.main">
          Desinscrição Realizada!
        </Typography>
        <Typography color="text.secondary">
          Você foi removido da nossa lista de newsletter.
          Sentiremos sua falta! 😢
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        className={className}
        sx={{
          p: 3,
          maxWidth: 500,
          mx: 'auto',
          ...sx
        }}
        {...props}
      >
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          📧 Desinscrever Newsletter
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          align="center" 
          sx={{ mb: 3 }}
        >
          Lamentamos ver você partir. Sua opinião é importante para nós.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {renderFeedback()}
        {renderEmailField()}
        {renderReasonForm()}
        {renderFeedbackField()}
        {renderActionButtons()}
      </Paper>

      {renderConfirmDialog()}
    </>
  );
};
