import { Icon as IconifyIcon } from '@iconify/react';
import { cn } from '../../lib/utils';
import React from 'react';

export interface IconProps {
  name: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  color?: string;
  [key: string]: any;
}

export function Icon({ name, className, ...props }: IconProps) {
  return (
    <IconifyIcon 
      icon={`solar:${name}`}
      className={cn('size-4', className)}
      {...props}
    />
  );
} 