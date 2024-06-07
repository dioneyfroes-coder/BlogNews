import { Container, Typography, Box } from '@mui/material';

export default function ErrorPage() {
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Algo está errado!
        </Typography>
        <Typography component="p" variant="body1">
          Tente novamente mais tarde.
        </Typography>
      </Box>
    </Container>
  );
};
