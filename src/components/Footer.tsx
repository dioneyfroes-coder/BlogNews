import { Container, Typography, Box } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 3, textAlign: 'center', backgroundColor: 'background.paper' }}>
      <Container maxWidth="md">
        <Typography variant="body2" color="textSecondary">
          © 2024 <Typography variant="body2" component="span" sx={{ textDecoration: 'underline' }}>Blog</Typography>. Todos os direitos reservados.
        </Typography >
        <Typography  variant="body2" color="textSecondary">
          Licença: CC BY-NC (Creative Commons Atribuição-NãoComercial)
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
