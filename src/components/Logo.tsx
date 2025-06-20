import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7 sm:w-8 sm:h-8',
    lg: 'w-8 h-8 sm:w-10 sm:h-10'
  };

  const innerSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5 sm:w-4 sm:h-4',
    lg: 'w-4 h-4 sm:w-5 sm:h-5'
  };

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5 sm:w-3 sm:h-3',
    lg: 'w-3 h-3 sm:w-4 sm:h-4'
  };

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 ${className}`}>
      {/* Logo icon - simple geometric shape */}
      <div className="relative">
        <div className={`${iconSizes[size]} bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/80 rounded-lg flex items-center justify-center`}>
          <div className={`${innerSizes[size]} bg-white rounded-sm`}></div>
        </div>
        <div className={`absolute -top-0.5 -right-0.5 ${dotSizes[size]} bg-[var(--accent)] rounded-full`}></div>
      </div>
      
      {/* Text */}
      <span className={`font-bold text-[var(--foreground)] ${sizeClasses[size]}`}>
        YouFi
      </span>
    </div>
  );
}; 