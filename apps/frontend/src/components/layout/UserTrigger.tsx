import { If, Then, Else } from 'react-if';
import { s } from './Header.styled';
import { UserTriggerProps } from './UserTrigger.types';

export const UserTrigger = ({ image, initials }: UserTriggerProps) => (
  <div className={s.userButton} aria-label="Меню пользователя">
    <If condition={!!image}>
      <Then>
        <img src={image ?? ''} alt="" className={s.userAvatar} referrerPolicy="no-referrer" />
      </Then>
      <Else>
        <span className={s.userFallback}>{initials}</span>
      </Else>
    </If>
  </div>
);
