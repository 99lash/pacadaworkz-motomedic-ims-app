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
        flex min-h-[80px] w-full rounded-md border border-gray-200 dark:border-gray-800 
        bg-white dark:bg-gray-900 px-3 py-2
        text-sm text-gray-900 dark:text-gray-100
        ring-offset-white dark:ring-offset-gray-900
        placeholder:text-gray-400 dark:placeholder:text-gray-500
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
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

