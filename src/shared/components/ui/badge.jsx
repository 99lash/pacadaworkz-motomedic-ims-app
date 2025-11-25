/**
 * Badge Component
 * 
 * A basic badge component following shadcn/ui API.
 * Replace with shadcn/ui Badge when ready.
 */

import React from 'react';
import PropTypes from 'prop-types';

const variantStyles = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/80',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
  outline: 'text-foreground border border-input',
};

export const Badge = React.forwardRef(({
  className = '',
  variant = 'default',
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`
        inline-flex items-center rounded-full border px-2.5 py-0.5
        text-xs font-semibold transition-colors
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        ${variantStyles[variant] || variantStyles.default}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
});

Badge.displayName = 'Badge';

Badge.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'secondary', 'destructive', 'outline']),
  children: PropTypes.node,
};

