import Image from 'next/image';
import { If, Then, Else } from 'react-if';
import { s } from './Header.styled';
import type { UserTriggerProps } from './UserTrigger.types';


export const UserTrigger = ({ image, initials }: UserTriggerProps) => (
  <div className={s.userButton} aria-label="Меню пользователя">
    <If condition={!!image}>
      <Then>
        <Image src={image ?? ''} alt="" width={32} height={32} className={s.userAvatar} referrerPolicy="no-referrer" />
      </Then>
      <Else>
        <span className={s.userFallback}>{initials}</span>
      </Else>
    </If>
  </div>
);
