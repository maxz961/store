import Image from 'next/image';
import { Mail } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { s } from '../Header.styled';
import type { UserTriggerProps } from './UserTrigger.types';


export const UserTrigger = ({ image, initials, hasUnreadMessages }: UserTriggerProps) => (
  <div className={s.userWrapper} aria-label="Меню пользователя">
    <div className={s.userButton}>
      <If condition={!!image}>
        <Then>
          <Image src={image ?? ''} alt="" width={32} height={32} className={s.userAvatar} referrerPolicy="no-referrer" />
        </Then>
        <Else>
          <span className={s.userFallback}>{initials}</span>
        </Else>
      </If>
    </div>
    <When condition={!!hasUnreadMessages}>
      <span className={s.unreadDot} data-testid="unread-dot" aria-label="Непрочитанные сообщения">
        <Mail className={s.unreadDotIcon} />
      </span>
    </When>
  </div>
);
