import Link from 'next/link';
import { Typography, Box } from '@mui/material';

const SomeComponentWithLinks = () => {
  return (
    <Box>
      <Typography variant="h6">Navegação</Typography>
      <Link href="/about" prefetch={true}>
        <a>Sobre Nós</a>
      </Link>
      <Link href="/contact" prefetch={true}>
        <a>Contato</a>
      </Link>
    </Box>
  );
};

export default SomeComponentWithLinks;
