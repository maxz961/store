'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { When } from 'react-if';
import { Spinner } from '@/components/ui/Spinner';
import { useAdminThreads } from '@/lib/hooks/useSupport';
import { getInitials } from '@/lib/utils';
import { s } from './page.styled';


const formatTime = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  return isToday
    ? date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
};


const AdminSupportPage = () => {
  const { data: threads = [], isLoading } = useAdminThreads();

  if (isLoading) {
    return (
      <div className={s.page}>
        <div className="flex justify-center py-16"><Spinner /></div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      {threads.length === 0 ? (
        <div className={s.emptyState}>
          <MessageCircle className={s.emptyIcon} />
          <p className={s.emptyText}>Нет обращений от пользователей</p>
        </div>
      ) : (
        <div className={s.list}>
          {threads.map(({ user, lastMessage, unreadCount }) => {
            const initials = getInitials(user.name, user.email);

            return (
              <Link key={user.id} href={`/admin/support/${user.id}`} className={s.threadCard}>
                <When condition={!!user.image}>
                  <Image
                    src={user.image ?? ''}
                    alt=""
                    width={40}
                    height={40}
                    className={s.avatar}
                    unoptimized
                  />
                </When>
                <When condition={!user.image}>
                  <div className={s.avatarFallback}>{initials}</div>
                </When>

                <div className={s.threadInfo}>
                  <p className={s.threadUser}>{user.name ?? user.email}</p>
                  <p className={s.threadEmail}>{user.email}</p>
                  <When condition={!!lastMessage}>
                    <p className={s.threadLastMsg}>
                      {lastMessage?.fromAdmin ? 'Вы: ' : ''}{lastMessage?.content}
                    </p>
                  </When>
                </div>

                <div className={s.threadMeta}>
                  <When condition={!!lastMessage}>
                    <span className={s.threadTime}>{lastMessage ? formatTime(lastMessage.createdAt) : ''}</span>
                  </When>
                  <When condition={unreadCount > 0}>
                    <span className={s.unreadBadge}>{unreadCount}</span>
                  </When>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminSupportPage;
