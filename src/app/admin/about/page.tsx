"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Alert,
  Divider,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Preview,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import NavigationBar from '@/components/NavigationBar';
import ImageThumbnail from '@/components/ImageThumbnail';
import SocialLinks from '@/components/SocialLinks';
import SlateEditor from '@/components/slate/SlateEditor';
import useAboutData from '@/lib/hooks/useAboutData';
import { SanitizationService } from '@/lib/sanitization';
import { htmlToSlate, slateToHtml } from '@/lib/slate/utils';

/**
 * Página de edição da página About (apenas para admins)
 */
const AdminAbout = () => {
  const router = useRouter();
  const { isAdmin, isAuthenticated } = useAuth();
  const { aboutData, setAboutData, saveAboutData } = useAboutData();
  const [sanitizedHtml, setSanitizedHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Verifica autenticação
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login');
    }
  }, [isAuthenticated, isAdmin, router]);

  // Sanitiza HTML quando aboutData muda
  useEffect(() => {
    if (aboutData?.text) {
      const result = SanitizationService.sanitizePostContent(aboutData.text);
      setSanitizedHtml(result.content);
    }
  }, [aboutData]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  if (!aboutData) {
    return (
      <>
        <NavigationBar />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography>Carregando dados...</Typography>
        </Container>
      </>
    );
  }

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      await saveAboutData();
      setSuccess('Página About atualizada com sucesso!');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError('Erro ao salvar alterações');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // Abre a página about em nova aba
    window.open('/about', '_blank');
  };

  const handleImageUrlChange = (value: string) => {
    setAboutData({ ...aboutData, imageURL: value });
  };

  const handleTextChange = (value: any) => {
    setAboutData({ ...aboutData, text: slateToHtml(value) });
  };

  return (
    <>
      <NavigationBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Cabeçalho */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/admin')}
            variant="outlined"
          >
            Voltar
          </Button>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1">
              Editar Página Sobre
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gerencie o conteúdo da página About do seu blog
            </Typography>
          </Box>
          <Button
            startIcon={<Preview />}
            onClick={handlePreview}
            variant="outlined"
          >
            Visualizar
          </Button>
        </Box>

        {/* Alertas */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Coluna Esquerda - Edição */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Conteúdo da Página
                </Typography>

                {/* Campo de Imagem */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    URL da Imagem
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={aboutData.imageURL || ''}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    InputProps={{
                      startAdornment: <ImageIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Editor de Texto */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Texto da Página
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <SlateEditor
                      initialValue={aboutData.text ? htmlToSlate(aboutData.text) : undefined}
                      onChange={handleTextChange}
                      placeholder="Escreva sobre sua empresa, missão, visão..."
                    />
                  </Paper>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Links Sociais */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Links Sociais
                  </Typography>
                  <SocialLinks />
                </Box>

                {/* Botão de Salvar */}
                <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={loading}
                    size="large"
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => router.push('/admin')}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Coluna Direita - Preview */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Pré-visualização
                </Typography>
                
                {/* Preview da Imagem */}
                {aboutData.imageURL && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Imagem
                    </Typography>
                    <ImageThumbnail 
                      imageUrl={aboutData.imageURL} 
                      altText="Preview About" 
                    />
                  </Box>
                )}

                {/* Preview do Texto */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Conteúdo
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
                    {sanitizedHtml ? (
                      <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
                    ) : (
                      <Typography variant="body2" color="text.secondary" fontStyle="italic">
                        Digite o conteúdo para ver a prévia...
                      </Typography>
                    )}
                  </Paper>
                </Box>

                {/* Dicas */}
                <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                  <Typography variant="caption" color="info.main" display="block" gutterBottom>
                    <strong>Dicas:</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    • Use imagens de alta qualidade (recomendado: 800x600px)
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    • Mantenha o texto claro e objetivo
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    • Links sociais são opcionais mas recomendados
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AdminAbout;
