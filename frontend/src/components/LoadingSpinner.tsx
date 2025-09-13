import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'medium',
  color = '#667eea',
}) => {
  // Map size prop to Tailwind classes
  const sizeClasses = {
    small: 'w-6 h-6 border-2 text-sm',
    medium: 'w-10 h-10 border-3 text-base',
    large: 'w-14 h-14 border-4 text-lg',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`rounded-full border-gray-200 border-solid animate-spin ${sizeClasses[size]}`}
        style={{ borderTopColor: color }}
      ></div>
      {message && (
        <p
          className={`font-medium text-gray-500 text-center ${
            size === 'small'
              ? 'text-sm'
              : size === 'large'
              ? 'text-lg'
              : 'text-base'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
