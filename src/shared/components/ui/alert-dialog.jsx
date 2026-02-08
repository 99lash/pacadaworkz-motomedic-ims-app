/**
 * AlertDialog Components
 * 
 * Basic alert dialog components following shadcn/ui API.
 * Uses native dialog for accessibility.
 * 
 * TODO: Replace with shadcn/ui AlertDialog for better UX
 * Command: npx shadcn-ui@latest add alert-dialog
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Context for dialog state
const AlertDialogContext = createContext({});

export const AlertDialog = ({ children, open: controlledOpen, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;
  
  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
};
AlertDialog.propTypes = { 
  children: PropTypes.node,
  open: PropTypes.bool,
  onOpenChange: PropTypes.func
};

export const AlertDialogTrigger = ({ children, asChild }) => {
  const { setOpen } = useContext(AlertDialogContext);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        children.props.onClick?.(e);
        setOpen(true);
      },
    });
  }
  
  return (
    <button type="button" onClick={() => setOpen(true)}>
      {children}
    </button>
  );
};
AlertDialogTrigger.propTypes = { children: PropTypes.node, asChild: PropTypes.bool };

export const AlertDialogContent = ({ children, className = '', role = 'alertdialog' }) => {
  const { open, setOpen } = useContext(AlertDialogContext);
  const dialogRef = useRef(null);
  
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    
    if (open) {
      dialog.showModal();
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [open]);
  
  return (
    <dialog
      ref={dialogRef}
      role={role}
      className={`
        fixed inset-0 z-50 p-0 m-auto
        w-full h-full border-0 bg-transparent
        backdrop:bg-black/50
        flex items-center justify-center
        ${open ? '' : 'hidden'}
      `}
      onClose={() => setOpen(false)}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setOpen(false);
        }
      }}
    >
      <div 
        className={`
          w-full max-w-lg scale-in-center
          gap-4 border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 shadow-xl
          rounded-lg border-gray-200 dark:border-gray-800
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </dialog>
  );
};
AlertDialogContent.propTypes = { children: PropTypes.node, className: PropTypes.string, role: PropTypes.string };

export const AlertDialogHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`}>
    {children}
  </div>
);
AlertDialogHeader.propTypes = { children: PropTypes.node, className: PropTypes.string };

export const AlertDialogFooter = ({ children, className = '' }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4 ${className}`}>
    {children}
  </div>
);
AlertDialogFooter.propTypes = { children: PropTypes.node, className: PropTypes.string };

export const AlertDialogTitle = ({ children, className = '', id }) => (
  <h2 id={id} className={`text-lg font-semibold text-foreground ${className}`}>
    {children}
  </h2>
);
AlertDialogTitle.propTypes = { children: PropTypes.node, className: PropTypes.string, id: PropTypes.string };

export const AlertDialogDescription = ({ children, className = '', id }) => (
  <p id={id} className={`text-sm text-muted-foreground ${className}`}>
    {children}
  </p>
);
AlertDialogDescription.propTypes = { children: PropTypes.node, className: PropTypes.string, id: PropTypes.string };

export const AlertDialogAction = ({ children, onClick, disabled, className = '' }) => {
  const { setOpen } = useContext(AlertDialogContext);
  
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.(e);
        setOpen(false);
      }}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};
AlertDialogAction.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export const AlertDialogCancel = ({ children, disabled, className = '' }) => {
  const { setOpen } = useContext(AlertDialogContext);
  
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
      }}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:pointer-events-none disabled:opacity-50 mt-2 sm:mt-0 ${className}`}
    >
      {children || 'Cancel'}
    </button>
  );
};
AlertDialogCancel.propTypes = { children: PropTypes.node, disabled: PropTypes.bool, className: PropTypes.string };

