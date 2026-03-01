import React from 'react';

// Import assets
import emptyBoxImg from 'figma:asset/13fef3d55d0f83a006ce4fb6aec16e96d874ee4c.png';
import packedBoxImg from 'figma:asset/a255a322ae727eb7ceaa259ca58231e9eaf6c397.png';
import packingBoxImg from 'figma:asset/23200c01cbda31da844adb75a38e2e932314fbf0.png';
import unpackingBoxImg from 'figma:asset/e27a7f8dbddfc1ba832a3b8203145792884447e9.png';

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
