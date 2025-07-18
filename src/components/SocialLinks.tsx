import React from 'react';
import { TextField, Box, IconButton, Grid, Button } from '@mui/material';
import { Facebook, Instagram, Twitter, LinkedIn, Add } from '@mui/icons-material';

const getSocialMediaIcon = (url: string): string | null => {
  const regexPatterns: Record<string, RegExp> = {
    Facebook: /facebook\.com/i,
    Instagram: /instagram\.com/i,
    Twitter: /twitter\.com/i,
    LinkedIn: /linkedin\.com/i,
  };

  for (const [socialMedia, pattern] of Object.entries(regexPatterns)) {
    if (pattern.test(url)) {
      return socialMedia;
    }
  }
  return null;
};

const socialMediaIcons: Record<string, React.ReactElement> = {
  Facebook: <Facebook />,
  Instagram: <Instagram />,
  Twitter: <Twitter />,
  LinkedIn: <LinkedIn />,
};

interface SocialLinksProps {
  socialLinks: string[];
  setSocialLinks?: (links: string[]) => void;
  isEditable: boolean;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ socialLinks, setSocialLinks, isEditable }) => {
  const handleSocialLinkChange = (index: number, value: string) => {
    if (!setSocialLinks) return;
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = value;
    setSocialLinks(updatedLinks);
  };

  const handleAddLink = () => {
    if (!setSocialLinks) return;
    setSocialLinks([...socialLinks, '']);
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
      <Grid container spacing={2}>
        {isEditable ? (
          <>
            {socialLinks.map((link, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  label={`Link ${index + 1}`}
                  value={link}
                  onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleAddLink}
              >
                Adicionar Link
              </Button>
            </Grid>
          </>
        ) : (
          socialLinks.map((link: string, index: number) => {
            const socialMedia = getSocialMediaIcon(link);
            return (
              <Grid item xs={12} key={index}>
                <IconButton
                  component="a"
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={socialMedia || 'Social Link'}
                  sx={{ p: 1 }}
                >
                  {socialMedia && socialMediaIcons[socialMedia] ? socialMediaIcons[socialMedia] : link}
                </IconButton>
              </Grid>
            );
          })
        )}
      </Grid>
    </Box>
  );
};

export default SocialLinks;
