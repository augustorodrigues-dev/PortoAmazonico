import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { FiX } from 'react-icons/fi';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef((props, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      backgroundColor: 'rgba(0,0,0,0.55)',
      backdropFilter: 'blur(2px)',
    }}
    {...props}
  />
));
DialogOverlay.displayName = 'DialogOverlay';

const DialogContent = React.forwardRef(({ children, style, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      style={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#fff',
        borderRadius: '14px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        padding: '2rem',
        maxHeight: '90vh',
        overflowY: 'auto',
        ...style,
      }}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '1.2rem', color: '#888', lineHeight: 1,
        }}
        aria-label="Fechar"
      >
        <FiX />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ style, ...props }) => (
  <div style={{ marginBottom: '1.25rem', ...style }} {...props} />
);

const DialogTitle = React.forwardRef((props, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.3rem' }}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef((props, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog, DialogTrigger, DialogClose,
  DialogContent, DialogHeader, DialogTitle, DialogDescription,
};
