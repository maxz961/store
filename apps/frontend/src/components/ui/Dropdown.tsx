'use client';

import { useState, useRef, useCallback, useEffect, type ReactNode } from 'react';
import { When } from 'react-if';
import { s } from './Dropdown.styled';


interface Props {
  trigger: ReactNode;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Dropdown = ({ trigger, children, onClose, className }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => setOpen((prev) => !prev), []);

  const handlePanelClick = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  return (
    <div className={className ?? s.wrapper} ref={ref}>
      <button type="button" onClick={handleToggle}>
        {trigger}
      </button>

      <When condition={open}>
        <div className={s.panel} onClick={handlePanelClick}>
          {children}
        </div>
      </When>
    </div>
  );
};
