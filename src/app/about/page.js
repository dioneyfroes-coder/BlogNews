import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import NavigationBar from '@/components/NavigationBar';

const About = () => {
  return (
    <Container component="main" maxWidth="md">
      <NavigationBar />
      <Box component="section" sx={{ my: 4 }}>
        <Typography component="header" variant="h3" gutterBottom>
          Sobre
        </Typography>
        <Typography component="p" variant="body1">
          Informações sobre o blog...
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
