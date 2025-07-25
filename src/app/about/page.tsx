// src/app/about/page.tsx
/**
 * Página Sobre (Pública)
 * @description Exibe informações sobre o blog sem funcionalidades de edição
 */

"use client";

import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Paper,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Email,
  Phone,
  WhatsApp,
  LocationOn,
} from '@mui/icons-material';
import useAboutData from '@/lib/hooks/useAboutData';

/**
 * Componente principal da página About
 */
export default function AboutPage() {
  const { aboutData } = useAboutData();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          {aboutData.title || 'Sobre Nós'}
        </Typography>
      </Box>

      {/* Conteúdo Principal */}
      <Grid container spacing={4}>
        {/* Imagem em Destaque */}
        {aboutData.imageURL && (
          <Grid item xs={12} md={5}>
            <Paper elevation={2} sx={{ overflow: 'hidden', borderRadius: 2 }}>
              <Box
                component="img"
                src={aboutData.imageURL}
                alt="Sobre nós"
                sx={{
                  width: '100%',
                  height: 300,
                  objectFit: 'cover',
                }}
              />
            </Paper>
          </Grid>
        )}

        {/* Conteúdo Textual */}
        <Grid item xs={12} md={aboutData.imageURL ? 7 : 12}>
          <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              {aboutData.text ? (
                <Box
                  dangerouslySetInnerHTML={{ __html: aboutData.text }}
                  sx={{
                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                      color: 'primary.main',
                      mb: 2,
                    },
                    '& p': {
                      mb: 2,
                      lineHeight: 1.7,
                    },
                    '& ul, & ol': {
                      pl: 3,
                      mb: 2,
                    },
                    '& blockquote': {
                      borderLeft: '4px solid',
                      borderColor: 'primary.main',
                      pl: 2,
                      fontStyle: 'italic',
                      color: 'text.secondary',
                    },
                  }}
                />
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Conteúdo não disponível no momento.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Informações de Contato */}
      {(aboutData.phone || aboutData.whatsapp || aboutData.email || aboutData.address) && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" component="h3" gutterBottom align="center">
            Entre em Contato
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {aboutData.phone && (
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={1}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Phone color="primary" sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Telefone
                    </Typography>
                    <Typography variant="body1">
                      {aboutData.phone}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {aboutData.whatsapp && (
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={1}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <WhatsApp color="primary" sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      WhatsApp
                    </Typography>
                    <Typography variant="body1">
                      {aboutData.whatsapp}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {aboutData.email && (
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={1}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Email color="primary" sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      E-mail
                    </Typography>
                    <Typography variant="body1">
                      {aboutData.email}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {aboutData.address && (
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={1}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <LocationOn color="primary" sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Endereço
                    </Typography>
                    <Typography variant="body1">
                      {aboutData.address}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* Redes Sociais */}
      {aboutData.socialLinks && aboutData.socialLinks.some(link => link.trim()) && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" component="h3" gutterBottom align="center">
            Siga-nos nas Redes Sociais
          </Typography>
          
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="center" 
            flexWrap="wrap"
            sx={{ mt: 3 }}
          >
            {aboutData.socialLinks[0] && (
              <IconButton
                component="a"
                href={aboutData.socialLinks[0]}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                sx={{ bgcolor: 'action.hover' }}
              >
                <Facebook />
              </IconButton>
            )}
            
            {aboutData.socialLinks[1] && (
              <IconButton
                component="a"
                href={aboutData.socialLinks[1]}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                sx={{ bgcolor: 'action.hover' }}
              >
                <Instagram />
              </IconButton>
            )}
            
            {aboutData.socialLinks[2] && (
              <IconButton
                component="a"
                href={aboutData.socialLinks[2]}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                sx={{ bgcolor: 'action.hover' }}
              >
                <Twitter />
              </IconButton>
            )}
            
            {aboutData.socialLinks[3] && (
              <IconButton
                component="a"
                href={aboutData.socialLinks[3]}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                sx={{ bgcolor: 'action.hover' }}
              >
                <LinkedIn />
              </IconButton>
            )}
          </Stack>
        </Box>
      )}
    </Container>
  );
}
