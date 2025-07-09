import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'muted';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

// Heading components
export const H1: React.FC<TypographyProps> = ({ 
  children, 
  className = '', 
  color = 'primary',
  weight = 'bold' 
}) => {
  const colorClasses = {
    primary: 'text-gray-900',
    secondary: 'text-gray-700',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    muted: 'text-gray-500'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <h1 className={`text-3xl ${colorClasses[color]} ${weightClasses[weight]} mb-2 ${className}`}>
      {children}
    </h1>
  );
};

export const H2: React.FC<TypographyProps> = ({ 
  children, 
  className = '', 
  color = 'primary',
  weight = 'semibold' 
}) => {
  const colorClasses = {
    primary: 'text-gray-900',
    secondary: 'text-gray-700',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    muted: 'text-gray-500'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <h2 className={`text-2xl ${colorClasses[color]} ${weightClasses[weight]} mb-4 ${className}`}>
      {children}
    </h2>
  );
};

export const H3: React.FC<TypographyProps> = ({ 
  children, 
  className = '', 
  color = 'primary',
  weight = 'semibold' 
}) => {
  const colorClasses = {
    primary: 'text-gray-900',
    secondary: 'text-gray-700',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    muted: 'text-gray-500'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <h3 className={`text-xl ${colorClasses[color]} ${weightClasses[weight]} mb-3 ${className}`}>
      {children}
    </h3>
  );
};

// Text components
export const Text: React.FC<TypographyProps> = ({ 
  children, 
  className = '', 
  color = 'secondary',
  weight = 'normal' 
}) => {
  const colorClasses = {
    primary: 'text-gray-900',
    secondary: 'text-gray-700',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    muted: 'text-gray-500'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <p className={`text-base ${colorClasses[color]} ${weightClasses[weight]} ${className}`}>
      {children}
    </p>
  );
};

export const TextSmall: React.FC<TypographyProps> = ({ 
  children, 
  className = '', 
  color = 'muted',
  weight = 'normal' 
}) => {
  const colorClasses = {
    primary: 'text-gray-900',
    secondary: 'text-gray-700',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    muted: 'text-gray-500'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <p className={`text-sm ${colorClasses[color]} ${weightClasses[weight]} ${className}`}>
      {children}
    </p>
  );
};

export const TextLarge: React.FC<TypographyProps> = ({ 
  children, 
  className = '', 
  color = 'primary',
  weight = 'medium' 
}) => {
  const colorClasses = {
    primary: 'text-gray-900',
    secondary: 'text-gray-700',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    muted: 'text-gray-500'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <p className={`text-lg ${colorClasses[color]} ${weightClasses[weight]} ${className}`}>
      {children}
    </p>
  );
};

// Label component
export const Label: React.FC<TypographyProps> = ({ 
  children, 
  className = '', 
  color = 'primary',
  weight = 'medium' 
}) => {
  const colorClasses = {
    primary: 'text-gray-700',
    secondary: 'text-gray-600',
    success: 'text-green-700',
    danger: 'text-red-700',
    warning: 'text-yellow-700',
    muted: 'text-gray-500'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <label className={`block text-sm ${colorClasses[color]} ${weightClasses[weight]} mb-2 ${className}`}>
      {children}
    </label>
  );
};

// Caption component
export const Caption: React.FC<TypographyProps> = ({ 
  children, 
  className = '', 
  color = 'muted',
  weight = 'normal' 
}) => {
  const colorClasses = {
    primary: 'text-gray-900',
    secondary: 'text-gray-700',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    muted: 'text-gray-500'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <span className={`text-xs ${colorClasses[color]} ${weightClasses[weight]} ${className}`}>
      {children}
    </span>
  );
}; 