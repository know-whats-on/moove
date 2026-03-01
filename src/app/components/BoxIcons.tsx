export const emptyBoxImg = '/boxes/EmptyBox.png';
export const packingBoxImg = '/boxes/PackingBox.png';
export const packedBoxImg = '/boxes/PackedBox.png';
export const unpackingBoxImg = '/boxes/UnpackingBox.png';
export const unpackedBoxImg = '/boxes/UnpackedBox.png';

import React from 'react';

// Import assets

// Shared styles for the icon container
const IconContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`w-full h-full flex items-center justify-center ${className}`}>
    {children}
  </div>
);

const BoxImage = ({ src, alt }: { src: string, alt: string }) => (
  <img 
    src={src} 
    alt={alt}
    className="w-full h-full object-contain drop-shadow-xl"
  />
);

export const EmptyBoxIcon = () => (
  <IconContainer>
    <BoxImage src={emptyBoxImg} alt="Empty Box" />
  </IconContainer>
);

export const PackingBoxIcon = () => (
  <IconContainer>
    <BoxImage src={packingBoxImg} alt="Packing Box" />
  </IconContainer>
);

export const PackedBoxIcon = () => (
  <IconContainer>
    <BoxImage src={packedBoxImg} alt="Packed Box" />
  </IconContainer>
);

export const UnpackingBoxIcon = () => (
  <IconContainer>
    <BoxImage src={unpackingBoxImg} alt="Unpacking Box" />
  </IconContainer>
);

export const UnpackedBoxIcon = () => (
  <IconContainer>
    <BoxImage src={emptyBoxImg} alt="Unpacked Box" />
  </IconContainer>
);
