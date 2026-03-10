'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
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
              <When condition={index > 0}>
                <ChevronRight className={s.separator} />
              </When>
              <If condition={isLast || !item.href}>
                <Then>
                  <span className={s.current}>{item.label}</span>
                </Then>
                <Else>
                  <Link href={item.href!} className={s.link}>
                    {item.label}
                  </Link>
                </Else>
              </If>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
