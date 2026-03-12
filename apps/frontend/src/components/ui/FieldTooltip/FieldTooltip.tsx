import { s } from './FieldTooltip.styled';
import type { FieldTooltipProps } from './FieldTooltip.types';


export const FieldTooltip = ({ text }: FieldTooltipProps) => (
  <span className={s.wrapper}>
    <span className={s.icon}>?</span>
    <span className={s.tooltip}>
      {text}
      <span className={s.arrow} />
    </span>
  </span>
);
