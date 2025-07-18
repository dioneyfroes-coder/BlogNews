// src/components/ImageThumbnail.tsx

import React from 'react';
import Image from 'next/image';

interface ImageThumbnailProps {
  imageUrl?: string;
  altText: string;
}

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ imageUrl, altText }) => {
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
