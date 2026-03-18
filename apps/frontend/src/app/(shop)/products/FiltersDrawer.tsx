'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { When } from 'react-if';
import { s } from './ProductCatalog.styled';


interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}


export const FiltersDrawer = ({ isOpen, onClose, children }: Props) => (
  <When condition={isOpen}>
    <>
      <div className={s.backdrop} onClick={onClose} />
      <div className={s.drawer}>
        <div className={s.drawerHeader}>
          <span className={s.drawerTitle}>Фильтры</span>
          <button onClick={onClose} className={s.drawerClose} aria-label="Закрыть фильтры">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className={s.drawerBody}>
          {children}
        </div>
      </div>
    </>
  </When>
);
