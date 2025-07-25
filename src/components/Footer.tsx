import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Divider,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import { 
  Email as EmailIcon,
  Phone as PhoneIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon 
} from '@mui/icons-material';
import NextLink from 'next/link';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const footerLinks = {
    navegacao: [
      { label: 'Home', href: '/' },
      { label: 'Sobre', href: '/about' },
      { label: 'Contato', href: '/contact' },
      { label: 'Admin', href: '/admin' }
    ],
    categorias: [
      { label: 'Tecnologia', href: '/search?category=tecnologia' },
      { label: 'Política', href: '/search?category=política' },
      { label: 'Esportes', href: '/search?category=esportes' },
      { label: 'Entretenimento', href: '/search?category=entretenimento' },
      { label: 'Ciência', href: '/search?category=ciência' },
      { label: 'Saúde', href: '/search?category=saúde' }
    ],
    legal: [
      { label: 'Política de Privacidade', href: '/privacy' },
      { label: 'Termos de Uso', href: '/terms' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Licença MIT', href: '/license' }
    ]
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
        borderTop: `1px solid ${theme.palette.divider}`,
        py: { xs: 3, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo e Descrição */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h5" 
              component="div" 
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              BlogNews
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Seu portal de notícias moderno e inteligente. Fique por dentro das 
              últimas novidades em tecnologia, política, esportes e muito mais.
            </Typography>
            
            {/* Contato */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                Contato
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  contato@blognews.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  +55 (11) 99999-9999
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Mapa do Site */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {/* Navegação Principal */}
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Navegação
                </Typography>
                <Box component="nav">
                  {footerLinks.navegacao.map((link) => (
                    <Link
                      key={link.href}
                      component={NextLink}
                      href={link.href}
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        py: 0.5,
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Box>
              </Grid>

              {/* Categorias */}
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Categorias
                </Typography>
                <Box component="nav">
                  {footerLinks.categorias.map((link) => (
                    <Link
                      key={link.href}
                      component={NextLink}
                      href={link.href}
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        py: 0.5,
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Box>
              </Grid>

              {/* Legal */}
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Legal
                </Typography>
                <Box component="nav">
                  {footerLinks.legal.map((link) => (
                    <Link
                      key={link.href}
                      component={NextLink}
                      href={link.href}
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        py: 0.5,
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2025 BlogNews. Todos os direitos reservados. 
            <Link 
              component={NextLink} 
              href="https://github.com/dioneyfroes-coder/BlogNews" 
              target="_blank"
              sx={{ ml: 1, color: 'inherit' }}
            >
              Projeto open source
            </Link>
          </Typography>

          {/* Social Links */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link
              href="https://github.com/dioneyfroes-coder"
              target="_blank"
              color="text.secondary"
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              <GitHubIcon fontSize="small" />
            </Link>
            <Link
              href="https://linkedin.com/in/dioneyfroes"
              target="_blank"
              color="text.secondary"
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              <LinkedInIcon fontSize="small" />
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
