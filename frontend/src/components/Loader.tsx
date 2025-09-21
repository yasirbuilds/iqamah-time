import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  className = '',
  text,
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <Loader2
            className={`animate-spin text-[#FDD535] ${sizeClasses[size]} ${className}`}
          />
        );

      case 'dots':
        return (
          <div className={`flex items-center gap-1 ${className}`}>
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`bg-[#FDD535] rounded-full animate-pulse ${
                  size === 'sm'
                    ? 'w-1.5 h-1.5'
                    : size === 'md'
                    ? 'w-2 h-2'
                    : size === 'lg'
                    ? 'w-3 h-3'
                    : 'w-4 h-4'
                }`}
                style={{
                  animationDelay: `${index * 0.15}s`,
                  animationDuration: '0.8s',
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div
            className={`bg-gradient-to-r from-[#CCAC2A] via-[#FDD535] to-[#CCAC2A] rounded-full animate-pulse ${sizeClasses[size]} ${className}`}
          />
        );

      default:
        return (
          <Loader2
            className={`animate-spin text-[#FDD535] ${sizeClasses[size]} ${className}`}
          />
        );
    }
  };

  const content = (
    <div className="flex flex-col items-center gap-3">
      {renderLoader()}
      {text && (
        <p className="text-white font-medium text-center max-w-xs">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-black/90 backdrop-blur-lg border border-[#FDD535]/70 rounded-2xl p-8 shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default Loader;