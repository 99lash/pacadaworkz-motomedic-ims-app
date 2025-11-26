/**
 * Input Component
 * 
 * A basic input component following shadcn/ui API.
 * Replace with shadcn/ui Input when ready.
 * 
 * TODO: Install shadcn/ui and replace this file
 * Command: npx shadcn-ui@latest add input
 */

import React from 'react';
import PropTypes from 'prop-types';

export const Input = React.forwardRef(({
  className = '',
  type = 'text',
  ...props
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={`
        flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 
        bg-white dark:bg-gray-900 px-3 py-2
        text-sm text-gray-900 dark:text-gray-100
        ring-offset-white dark:ring-offset-gray-900
        file:border-0 file:bg-transparent file:text-sm file:font-medium
        placeholder:text-gray-400 dark:placeholder:text-gray-500
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      {...props}
    />
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
};

