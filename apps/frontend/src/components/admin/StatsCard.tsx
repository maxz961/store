import { type ReactNode } from 'react';
import { When } from 'react-if';
import { s } from './StatsCard.styled';


interface Props {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
}

export const StatsCard = ({ label, value, subtitle, icon }: Props) => {
  return (
    <div className={s.card}>
      <div className={s.header}>
        <p className={s.label}>{label}</p>
        <div className={s.iconWrapper}>{icon}</div>
      </div>
      <p className={s.value}>{value}</p>
      <When condition={!!subtitle}>
        <p className={s.subtitle}>{subtitle}</p>
      </When>
    </div>
  );
};
