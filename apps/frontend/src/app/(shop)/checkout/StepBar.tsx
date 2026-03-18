'use client';

import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import type { CheckoutStep } from './page.types';


interface StepBarProps {
  step: CheckoutStep;
}

export const StepBar = ({ step }: StepBarProps) => {
  const { t } = useLanguage();

  return (
    <div className={s.stepBar}>
      <div className={s.stepItem}>
        <span className={cn(s.stepDot, step === 'info' ? s.stepDotActive : s.stepDotDone)}>1</span>
        <span className={cn(step === 'info' ? s.stepLabelActive : s.stepLabelInactive)}>{t('checkout.step1')}</span>
      </div>
      <div className={s.stepLine} />
      <div className={s.stepItem}>
        <span className={cn(s.stepDot, step === 'payment' ? s.stepDotActive : s.stepDotInactive)}>2</span>
        <span className={cn(step === 'payment' ? s.stepLabelActive : s.stepLabelInactive)}>{t('checkout.step2')}</span>
      </div>
    </div>
  );
};
