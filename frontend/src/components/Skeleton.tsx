import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rectangle';
  width?: string | number;
  height?: string | number;
  count?: number;
  animate?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangle',
  width,
  height,
  count = 1,
  animate = true,
}) => {
  const baseClasses = `bg-gradient-to-r from-[#FDD535]/20 via-[#FDD535]/10 to-[#FDD535]/20 rounded ${
    animate ? 'animate-pulse' : ''
  }`;

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded';
      case 'circle':
        return 'rounded-full';
      case 'rectangle':
      default:
        return 'rounded';
    }
  };

  const getSizeClasses = () => {
    if (width && height) {
      return '';
    }
    
    switch (variant) {
      case 'text':
        return 'w-full h-4';
      case 'circle':
        return 'w-8 h-8';
      case 'rectangle':
      default:
        return 'w-full h-4';
    }
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${className}`}
          style={style}
        />
      ))}
    </>
  );
};

export default Skeleton;