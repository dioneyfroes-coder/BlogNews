// src/components/ImageThumbnail.js

import React from 'react';
import Image from 'next/image';

const ImageThumbnail = ({ imageUrl, altText }) => {
  return (
    <Image
      src={imageUrl || '/default-image.jpg'}
      alt={altText}
      width={500}
      height={300}
      style={{ objectFit: 'cover' }} // Substitui objectFit="cover"
      priority 
    />
  );
};

export default ImageThumbnail;
