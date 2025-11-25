/**
 * Label Component
 * 
 * A basic label component following shadcn/ui API.
 * Replace with shadcn/ui Label when ready.
 */

import React from 'react';
import PropTypes from 'prop-types';

export const Label = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <label
      ref={ref}
      className={`
        text-sm font-medium leading-none
        peer-disabled:cursor-not-allowed peer-disabled:opacity-70
        ${className}
      `}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = 'Label';

Label.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

