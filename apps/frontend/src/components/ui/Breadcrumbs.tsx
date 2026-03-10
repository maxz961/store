'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { s } from './Breadcrumbs.styled';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: Props) => {
  return (
    <nav aria-label="Breadcrumb" className={s.nav}>
      <ol className={s.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className={s.item}>
              {index > 0 && <ChevronRight className={s.separator} />}
              {isLast || !item.href ? (
                <span className={s.current}>{item.label}</span>
              ) : (
                <Link href={item.href} className={s.link}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
