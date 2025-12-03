
import React, { createContext, useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Context for dialog state
const DialogContext = createContext({});

export const Dialog = ({ open, onOpenChange, children, onInteractOutside, modal = true }) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange, onInteractOutside, modal }}>
      {children}
    </DialogContext.Provider>
  );
};
Dialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  children: PropTypes.node,
  onInteractOutside: PropTypes.func,
  modal: PropTypes.bool,
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
  const { open, onOpenChange, onInteractOutside, modal } = useContext(DialogContext);
  const dialogRef = useRef(null);
  const isClosingProgrammaticallyRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      // Show the dialog
      if (modal) {
        dialog.showModal();
      } else {
        dialog.show();
      }
      isClosingProgrammaticallyRef.current = false;
    } else {
      // Force close the dialog
      isClosingProgrammaticallyRef.current = true;
      try {
        if (dialog.open) {
          dialog.close();
        }
      } catch {
        // Dialog might not be open, ignore error
      }
      // Also ensure the open attribute is removed
      dialog.removeAttribute('open');
    }
  }, [open, modal]);
  
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    
    const handleClose = () => {
      // Only trigger onOpenChange if this is a user-initiated close
      // (not programmatic from our own code)
      if (!isClosingProgrammaticallyRef.current && open) {
        onOpenChange(false);
      }
      isClosingProgrammaticallyRef.current = false;
    };
    
    const handleCancel = (e) => {
      // If onInteractOutside is provided and returns false, prevent closing
      if (onInteractOutside && onInteractOutside(e) === false) {
        e.preventDefault();
        return;
      }
      // Otherwise, allow the close (this is user-initiated)
      isClosingProgrammaticallyRef.current = false;
      if (open) {
        onOpenChange(false);
      }
    };
    
    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onOpenChange, onInteractOutside, open]);
  
  return (
    <dialog
      ref={dialogRef}
      className={`fixed inset-0 z-50 flex items-center justify-center w-full h-full border-0 bg-transparent backdrop:bg-black/50 ${open ? '' : 'hidden'}`}
      style={{ margin: 0, padding: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          // Check if we should prevent closing
          if (onInteractOutside && onInteractOutside(e) === false) {
            return;
          }
          onOpenChange(false);
        }
      }}
    >
      <div className={`
        w-full max-w-lg max-h-[90vh]
        border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-lg
        rounded-lg
        text-gray-900 dark:text-gray-100
        overflow-hidden flex flex-col
        ${className}
      `}>
        {children}
      </div>
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

