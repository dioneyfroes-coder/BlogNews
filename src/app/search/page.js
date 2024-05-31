"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Typography, CircularProgress, List, ListItem, Card, CardContent } from '@mui/material';
import sanitizeHtml from 'sanitize-html';
import NavigationBar from '@/components/NavigationBar';

const Search = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${query}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results);
        } else {
          console.error(`Error fetching search results: ${res.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  return (
    <Box sx={{ padding: 2,  display: 'flex' }}>
      <NavigationBar />
      <Typography variant="h4" gutterBottom>
        Resultados por "{query}"
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : results.length > 0 ? (
        <List>
          {results.map((result) => (
            <ListItem key={result._id} sx={{ marginBottom: 2 }}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {result.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(result.content, {
                        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                          'img', 'iframe', 'div', 'pre', 'ul', 'ol', 'li', 'a', 'b', 'i', 'u', 's', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
                        ]),
                        allowedAttributes: {
                          ...sanitizeHtml.defaults.allowedAttributes,
                          img: ['src', 'alt'],
                          a: ['href'],
                          iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen']
                        },
                        allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'www.youtu.be', 'youtu.be']
                      })
                    }}
                  />
                  <Typography variant="caption" display="block" gutterBottom>
                    By {result.author}
                  </Typography>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No results found.</Typography>
      )}
    </Box>
  );
};

export default Search;
