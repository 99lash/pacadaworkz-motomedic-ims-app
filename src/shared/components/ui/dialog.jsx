/**
 * Dialog Components
 * 
 * Basic dialog components following shadcn/ui API.
 * Uses native dialog element for accessibility.
 * 
 * TODO: Replace with shadcn/ui Dialog (uses Radix) for better UX
 * Command: npx shadcn-ui@latest add dialog
 */

import React, { createContext, useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Context for dialog state
const DialogContext = createContext({});

export const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};
Dialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export const DialogTrigger = ({ children, asChild }) => {
  const { onOpenChange } = useContext(DialogContext);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        children.props.onClick?.(e);
        onOpenChange(true);
      },
    });
  }
  
  return (
    <button type="button" onClick={() => onOpenChange(true)}>
      {children}
    </button>
  );
};
DialogTrigger.propTypes = { children: PropTypes.node, asChild: PropTypes.bool };

export const DialogContent = ({ children, className = '' }) => {
  const { open, onOpenChange } = useContext(DialogContext);
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
  
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    
    const handleClose = () => onOpenChange(false);
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onOpenChange]);
  
  return (
    <dialog
      ref={dialogRef}
      className={`
        fixed left-[50%] top-[50%] z-50
        w-full max-w-lg translate-x-[-50%] translate-y-[-50%]
        gap-4 border bg-background p-6 shadow-lg
        rounded-lg
        backdrop:bg-black/50
        ${className}
      `}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      {children}
    </dialog>
  );
};
DialogContent.propTypes = { children: PropTypes.node, className: PropTypes.string };

export const DialogHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}>
    {children}
  </div>
);
DialogHeader.propTypes = { children: PropTypes.node, className: PropTypes.string };

export const DialogFooter = ({ children, className = '' }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>
    {children}
  </div>
);
DialogFooter.propTypes = { children: PropTypes.node, className: PropTypes.string };

export const DialogTitle = ({ children, className = '' }) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h2>
);
DialogTitle.propTypes = { children: PropTypes.node, className: PropTypes.string };

export const DialogDescription = ({ children, className = '', id }) => (
  <p id={id} className={`text-sm text-muted-foreground ${className}`}>
    {children}
  </p>
);
DialogDescription.propTypes = { children: PropTypes.node, className: PropTypes.string, id: PropTypes.string };

