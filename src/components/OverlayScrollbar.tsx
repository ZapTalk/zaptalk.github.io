import React from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';

interface OverlayScrollbarProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  defer?: boolean;
}

export function OverlayScrollbar({ 
  children, 
  className, 
  style,
  defer = true 
}: OverlayScrollbarProps) {
  return (
    <OverlayScrollbarsComponent
      className={className}
      style={style}
      defer={defer}
      options={{
        scrollbars: {
          theme: 'os-theme-dark',
          visibility: 'auto',
          autoHide: 'leave',
          autoHideDelay: 800,
        },
        overflow: {
          x: 'hidden',
          y: 'scroll',
        },
      }}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}
