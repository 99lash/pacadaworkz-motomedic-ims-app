/**
 * Textarea Component
 * 
 * A basic textarea component following shadcn/ui API.
 * Replace with shadcn/ui Textarea when ready.
 */

import React from 'react';
import PropTypes from 'prop-types';

export const Textarea = React.forwardRef(({
  className = '',
  ...props
}, ref) => {
  return (
    <textarea
      ref={ref}
      className={`
        flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2
        text-sm ring-offset-background
        placeholder:text-muted-foreground
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

Textarea.propTypes = {
  className: PropTypes.string,
};

