import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { If, Then, Else } from 'react-if';
import { Button } from '@/components/ui/button';
import { s } from './page.styled';
import { UserCardProps } from './page.types';


export const UserCard = ({ name, email, image, initials, memberSince, onLogout }: UserCardProps) => {
  const handleLogout = () => onLogout();

  return (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <If condition={!!image}>
          <Then>
            <Image src={image ?? ''} alt="" width={80} height={80} className={s.avatar} referrerPolicy="no-referrer" />
          </Then>
          <Else>
            <span className={s.avatarFallback}>{initials}</span>
          </Else>
        </If>
        <div className={s.userInfo}>
          <p className={s.userName}>{name ?? 'Пользователь'}</p>
          <p className={s.userEmail}>{email}</p>
          <p className={s.userMeta}>Участник с {memberSince}</p>
        </div>
      </div>

      <div className={s.actions}>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className={s.logoutIcon} />
          Выйти
        </Button>
      </div>
    </div>
  );
};
