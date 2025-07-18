"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { TextField, Box, Typography, Button, Grid } from '@mui/material';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { WhatsApp } from '@mui/icons-material';
import ImageThumbnail from '@/components/ImageThumbnail';
import useAboutData from '@/hooks/useAboutData';
import sanitizeAndFixHtml from '@/utils/sanitizeAndFixHtml';
import SocialLinks from '@/components/SocialLinks';

const QuillNoSSRWrapper = dynamic(() => import('react-quill'), { ssr: false });

const AboutPage = () => {
  const { data: session } = useSession();
  const { aboutData, setAboutData, saveAboutData } = useAboutData();
  const [sanitizedHtml, setSanitizedHtml] = useState('');

  useEffect(() => {
    if (aboutData?.text) {
      setSanitizedHtml(sanitizeAndFixHtml(aboutData.text));
    }
  }, [aboutData]);

  if (!aboutData) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ImageThumbnail imageUrl={aboutData.imageURL} altText="About Us" />
          {session && (
            <Box mt={2}>
              <TextField
                label="URL da Imagem"
                value={aboutData.imageURL}
                onChange={(e) => setAboutData({ ...aboutData, imageURL: e.target.value })}
                fullWidth
                margin="normal"
              />
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {session ? (
              <>
                <TextField
                  label="Título"
                  value={aboutData.title}
                  onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                  fullWidth
                  margin="normal"
                />
                <Box mt={2}>
                  <QuillNoSSRWrapper
                    value={aboutData.text}
                    onChange={(value) => setAboutData({ ...aboutData, text: value })}
                    theme="snow"
                  />
                </Box>
                <Box mt={2}>
                  <TextField
                    label="Telefone"
                    value={aboutData.phone}
                    onChange={(e) => setAboutData({ ...aboutData, phone: e.target.value })}
                    fullWidth
                    margin="normal"
                  />
                </Box>
                <Box mt={2}>
                  <TextField
                    label="WhatsApp"
                    value={aboutData.whatsapp}
                    onChange={(e) => setAboutData({ ...aboutData, whatsapp: e.target.value })}
                    fullWidth
                    margin="normal"
                  />
                </Box>
                <Box mt={2}>
                  <TextField
                    label="Endereço"
                    value={aboutData.address}
                    onChange={(e) => setAboutData({ ...aboutData, address: e.target.value })}
                    fullWidth
                    margin="normal"
                  />
                </Box>
                <Box mt={2}>
                  <TextField
                    label="Email"
                    value={aboutData.email}
                    onChange={(e) => setAboutData({ ...aboutData, email: e.target.value })}
                    fullWidth
                    margin="normal"
                  />
                </Box>
                <Box mt={2}>
                  <SocialLinks
                    socialLinks={aboutData.socialLinks}
                    setSocialLinks={(newLinks) => setAboutData({ ...aboutData, socialLinks: newLinks })}
                    isEditable={true}
                  />
                </Box>
                <Box mt={4}>
                  <Button variant="contained" color="primary" onClick={saveAboutData}>
                    Salvar
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h5">{aboutData.title}</Typography>
                <Box mt={2} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
                <Box mt={2}>
                  <WhatsApp /> {aboutData.whatsapp}
                </Box>
                <Box mt={2}>
                  <Typography>{aboutData.phone}</Typography>
                </Box>
                <Box mt={2}>
                  <Typography>{aboutData.address}</Typography>
                </Box>
                <Box mt={2}>
                  <Typography>{aboutData.email}</Typography>
                </Box>
                <Box mt={2}>
                  <SocialLinks socialLinks={aboutData.socialLinks} isEditable={false} />
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutPage;
