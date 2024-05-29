"use client";

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const Search = () => {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch(`/api/search?q=${q}`);
      const data = await res.json();
      setResults(data.results);
    };

    if (q) {
      fetchResults();
    }
  }, [q]);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Resultados da pesquisa para "{q}"
      </Typography>
      <List>
        {results.map((result) => (
          <ListItem key={result.id}>
            <ListItemText primary={result.title} secondary={result.excerpt} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Search;
