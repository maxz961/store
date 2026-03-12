'use client';

import { use, useRef, useEffect, useState, useCallback, KeyboardEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { When } from 'react-if';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { useAdminThread, useAdminReply } from '@/lib/hooks/useSupport';
import { getInitials } from '@/lib/utils';
import { s } from './page.styled';


const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });


const AdminSupportThreadPage = ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = use(params);
  const { data, isLoading } = useAdminThread(userId);
  const reply = useAdminReply(userId);

  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [data?.messages, scrollToBottom]);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || reply.isPending) return;
    reply.mutate(trimmed, { onSuccess: () => setText('') });
  }, [text, reply]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, []);

  if (isLoading) {
    return (
      <div className={s.page}>
        <div className="flex justify-center py-16"><Spinner /></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={s.page}>
        <p className="text-sm text-destructive">Пользователь не найден</p>
      </div>
    );
  }

  const { user, messages } = data;
  const initials = getInitials(user.name, user.email);

  return (
    <div className={s.page}>
      <Link href="/admin/support" className={s.backLink}>
        <ArrowLeft className="h-4 w-4" />
        Все обращения
      </Link>

      <div className={s.userHeader}>
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
        <div className={s.userInfo}>
          <p className={s.userName}>{user.name ?? user.email}</p>
          <p className={s.userEmail}>{user.email}</p>
        </div>
      </div>

      <div className={s.chatCard}>
        <div className={s.chatMessages}>
          {messages.length === 0 && (
            <div className={s.emptyState}>
              <p className={s.emptyText}>Нет сообщений</p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={msg.fromAdmin ? s.messageRowAdmin : s.messageRowUser}>
              <div>
                <p className={msg.fromAdmin ? s.senderLabel : s.senderLabelRight}>
                  {msg.fromAdmin ? 'Вы (поддержка)' : (user.name ?? user.email)}
                </p>
                <div className={msg.fromAdmin ? s.bubbleAdmin : s.bubbleUser}>
                  {msg.content}
                </div>
                <p className={msg.fromAdmin ? s.messageTime : s.messageTimeRight}>
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        <div className={s.inputArea}>
          <div className={s.inputRow}>
            <textarea
              className={s.textarea}
              placeholder="Ответить пользователю... (Enter — отправить, Shift+Enter — перенос)"
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <Button onClick={handleSend} disabled={!text.trim() || reply.isPending}>
              {reply.isPending ? <Spinner /> : 'Отправить'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportThreadPage;
