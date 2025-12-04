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

export const AlertDialog = ({ children }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
};
AlertDialog.propTypes = { children: PropTypes.node };

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
      dialog.close();
    }
  }, [open]);
  
  return (
    <dialog
      ref={dialogRef}
      role={role}
      className={`
        fixed left-[50%] top-[50%] z-50
        w-full max-w-lg translate-x-[-50%] translate-y-[-50%]
        gap-4 border-2 bg-background text-foreground p-6 shadow-xl
        rounded-lg border-border
        backdrop:bg-black/90
        ${className}
      `}
      onClose={() => setOpen(false)}
    >
      {children}
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
        onClick?.(e);
        setOpen(false);
      }}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 ${className}`}
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
      onClick={() => setOpen(false)}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 mt-2 sm:mt-0 ${className}`}
    >
      {children || 'Cancel'}
    </button>
  );
};
AlertDialogCancel.propTypes = { children: PropTypes.node, disabled: PropTypes.bool, className: PropTypes.string };

