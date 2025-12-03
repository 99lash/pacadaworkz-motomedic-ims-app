import React from 'react';
import PropTypes from 'prop-types';

export const Select = ({ children, value, onValueChange, ...props }) => {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // ✅ Fix: Map onValueChange to onChange for native select elements
      const childProps = { value, ...props };
      if (onValueChange) {
        childProps.onChange = (e) => onValueChange(e.target.value);
      }
      return React.cloneElement(child, childProps);
    }
    return child;
  });
};

Select.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string,
  onValueChange: PropTypes.func,
};

export const SelectTrigger = React.forwardRef(({ children, className = '', ...props }, ref) => (
  <select
    ref={ref}
    className={`
      flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 
      bg-white dark:bg-gray-900 px-3 py-2 text-sm
      text-gray-900 dark:text-gray-100
      focus:outline-none focus:ring-2 focus:ring-blue-500
      disabled:cursor-not-allowed disabled:opacity-50
      ${className}
    `}
    {...props}
  >
    {children}
  </select>
));

SelectTrigger.displayName = 'SelectTrigger';
SelectTrigger.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export const SelectValue = ({ placeholder, ...props }) => {
  return <option value="" {...props}>{placeholder}</option>;
};

SelectValue.propTypes = {
  placeholder: PropTypes.string,
};

export const SelectContent = ({ children }) => {
  return <>{children}</>;
};

SelectContent.propTypes = {
  children: PropTypes.node,
};

export const SelectItem = ({ children, value, ...props }) => {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
};

SelectItem.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string.isRequired,
};

