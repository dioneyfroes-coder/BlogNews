// src/components/ImageThumbnail.js

import React from 'react';
import { CardMedia } from '@mui/material';

const ImageThumbnail = ({ imageUrl, altText }) => {
  return (
    <CardMedia
      component="img"
      height="140"
      image={imageUrl || '/default-image.jpg'}
      alt={altText}
    />
  );
};

export default ImageThumbnail;
