import { cn } from '@/lib/utils';
import { s } from './Spinner.styled';


interface SpinnerProps {
  size?: 'sm' | 'default';
  className?: string;
}


export const Spinner = ({ size = 'default', className }: SpinnerProps) => {
  if (size === 'sm') {
    return <div className={cn(s.spinnerSm, className)} />;
  }

  return (
    <div className={s.wrapper}>
      <div className={s.spinner} />
    </div>
  );
};
