

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';

// Create a context for the select component
const SelectContext = createContext();

export const Select = ({ children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleOpenChange = (open) => {
    setIsOpen(open);
  };

  const handleValueChange = (newValue) => {
    if (onValueChange) {
      onValueChange(newValue);
    }
    setIsOpen(false); // Close the dropdown after selecting a value
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <SelectContext.Provider value={{ isOpen, handleOpenChange, value, handleValueChange, ...props }}>
      <div className="relative" ref={selectRef}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

Select.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string,
  onValueChange: PropTypes.func,
};

export const SelectTrigger = React.forwardRef(({ children, className = '', ...props }, ref) => {
  const { isOpen, handleOpenChange, value } = useContext(SelectContext);

  const selectedChild = React.Children.toArray(children).find(
    (child) => child.props.value === value
  );

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => handleOpenChange(!isOpen)}
      className={`
        flex h-10 w-full items-center justify-between rounded-md border border-gray-200 
        dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm 
        text-gray-900 dark:text-gray-100
        focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      {...props}
    >
      {selectedChild || <SelectValue />}
      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
});

SelectTrigger.displayName = 'SelectTrigger';
SelectTrigger.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export const SelectValue = ({ placeholder }) => {
  const { value } = useContext(SelectContext);
  return <span className="text-gray-500">{value || placeholder}</span>;
};

SelectValue.propTypes = {
  placeholder: PropTypes.string,
};

export const SelectContent = ({ children, className = '' }) => {
  const { isOpen } = useContext(SelectContext);

  if (!isOpen) return null;

  return (
    <div
      className={`
        absolute z-10 mt-1 w-full rounded-md border border-gray-200 
        dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg
        ${className}
      `}
    >
      <div className="p-1">
        {children}
      </div>
    </div>
  );
};

SelectContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export const SelectItem = ({ children, value, ...props }) => {
  const { handleValueChange } = useContext(SelectContext);

  return (
    <div
      onClick={() => handleValueChange(value)}
      className="
        relative flex w-full cursor-pointer select-none items-center 
        rounded-sm py-1.5 px-2 text-sm outline-none 
        hover:bg-gray-100 dark:hover:bg-gray-800
        focus:bg-gray-100 dark:focus:bg-gray-800
      "
      {...props}
    >
      {children}
    </div>
  );
};

SelectItem.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string.isRequired,
};



