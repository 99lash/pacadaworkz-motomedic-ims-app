/**
 * Card Components
 * 
 * Basic card components following shadcn/ui API.
 * Replace with shadcn/ui Card when ready.
 */

import React from 'react';
import PropTypes from 'prop-types';

export const Card = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      // className={`rounded-lg border border-gray-200 bg-card text-card-foreground shadow-sm pt-4 ${className}`}
      className={`rounded-lg border dark:border-gray-500 bg-card shadow-sm pt-4 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = 'Card';
Card.propTypes = { className: PropTypes.string, children: PropTypes.node };

export const CardHeader = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`flex flex-col space-y-1.5 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
CardHeader.displayName = 'CardHeader';
CardHeader.propTypes = { className: PropTypes.string, children: PropTypes.node };

export const CardTitle = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <h3
      ref={ref}
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
});
CardTitle.displayName = 'CardTitle';
CardTitle.propTypes = { className: PropTypes.string, children: PropTypes.node };

export const CardDescription = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <p
      ref={ref}
      className={`text-sm text-muted-foreground ${className}`}
      {...props}
    >
      {children}
    </p>
  );
});
CardDescription.displayName = 'CardDescription';
CardDescription.propTypes = { className: PropTypes.string, children: PropTypes.node };

export const CardContent = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`p-6 pt-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
CardContent.displayName = 'CardContent';
CardContent.propTypes = { className: PropTypes.string, children: PropTypes.node };

export const CardFooter = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`flex items-center p-6 pt-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
CardFooter.displayName = 'CardFooter';
CardFooter.propTypes = { className: PropTypes.string, children: PropTypes.node };

