/**
 * @fileoverview Componente simplificado para seleção de plataforma social
 */

import React, { useCallback } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Avatar,
  Typography,
  Chip
} from '@mui/material';
import type { SocialPlatform } from '../types';

interface PlatformSelectorSimpleProps {
  value?: SocialPlatform;
  onChange?: (platform: SocialPlatform | null) => void;
  options?: SocialPlatform[];
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

const PLATFORM_NAMES: Record<SocialPlatform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram', 
  twitter: 'Twitter/X',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  discord: 'Discord',
  github: 'GitHub',
  website: 'Website',
  email: 'Email',
  phone: 'Telefone',
  custom: 'Personalizado'
};

const DEFAULT_OPTIONS: SocialPlatform[] = [
  'facebook',
  'instagram',
  'twitter',
  'linkedin',
  'youtube',
  'tiktok',
  'whatsapp',
  'telegram',
  'discord',
  'github',
  'website',
  'email',
  'phone',
  'custom'
];

export const PlatformSelectorSimple: React.FC<PlatformSelectorSimpleProps> = ({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  label = "Plataforma",
  placeholder = "Selecione uma plataforma",
  error = false,
  helperText,
  disabled = false,
  fullWidth = true
}) => {
  const renderOption = useCallback((props: any, option: SocialPlatform) => (
    <Box component="li" {...props} key={option}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
          {PLATFORM_NAMES[option]?.[0] || '?'}
        </Avatar>
        <Typography variant="body2">
          {PLATFORM_NAMES[option] || option}
        </Typography>
      </Box>
    </Box>
  ), []);

  return (
    <Autocomplete
      value={value || null}
      onChange={(_, newValue) => onChange?.(newValue)}
      options={options}
      getOptionLabel={(option) => PLATFORM_NAMES[option] || option}
      renderOption={renderOption}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          fullWidth={fullWidth}
        />
      )}
      disabled={disabled}
      disableClearable={false}
    />
  );
};

export default PlatformSelectorSimple;
