import { s } from './Spinner.styled';


interface SpinnerProps {
  size?: 'sm' | 'default';
}


export const Spinner = ({ size = 'default' }: SpinnerProps) => {
  if (size === 'sm') {
    return <div className={s.spinnerSm} />;
  }

  return (
    <div className={s.wrapper}>
      <div className={s.spinner} />
    </div>
  );
};
