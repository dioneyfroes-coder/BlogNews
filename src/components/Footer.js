import { Container, Typography, Box } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 3, textAlign: 'center', backgroundColor: 'background.paper' }}>
      <Container maxWidth="md">
        <Typography variant="body2" color="textSecondary">
          © 2024 <Typography variant="body2" component="span" sx={{ textDecoration: 'underline' }}>Blog News</Typography>. Todos os direitos reservados.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
