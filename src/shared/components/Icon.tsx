import type { CSSProperties } from 'react';

interface IconProps {
  name: string;
  filled?: boolean;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export default function Icon({ name, filled, size, className, style }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ''}`}
      style={{
        fontVariationSettings: filled ? "'FILL' 1" : undefined,
        fontSize: size,
        ...style,
      }}
    >
      {name}
    </span>
  );
}
