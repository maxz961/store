import { When } from 'react-if';
import type { Props } from './StatsCard.types';
import { s } from './StatsCard.styled';


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
