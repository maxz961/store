'use client';

export const dynamic = 'force-dynamic';

import { useRef, useEffect, useState, useCallback, KeyboardEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMyMessages, useSendMessage } from '@/lib/hooks/useSupport';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';


const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });


const SupportPage = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const breadcrumbs = [
    { label: t('nav.home'), href: '/' },
    { label: t('profile.breadcrumb'), href: '/account/profile' },
    { label: t('support.title') },
  ];
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: messages = [], isLoading } = useMyMessages();
  const sendMessage = useSendMessage();

  useEffect(() => {
    router.prefetch('/account/profile');
    router.prefetch('/account/orders');
    router.prefetch('/account/favorites');
  }, [router]);

  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || sendMessage.isPending) return;
    sendMessage.mutate(trimmed, { onSuccess: () => setText('') });
  }, [text, sendMessage]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, []);

  if (authLoading) {
    return (
      <div className={s.page}>
        <div className="flex justify-center py-16"><Spinner /></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={s.page}>
        <div className={s.notAuth}>
          <MessageCircle className="h-12 w-12 text-muted-foreground" />
          <p className={s.notAuthTitle}>{t('support.notAuth')}</p>
          <p className={s.notAuthText}>{t('support.notAuthText')}</p>
          <Link href="/login"><Button>{t('support.login')}</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />
      <div className={s.header}>
        <p className={s.pageSubtitle}>{t('support.subtitle')}</p>
      </div>

      <div className={s.chatCard}>
        <div className={s.chatMessages}>
          {isLoading && (
            <div className="flex justify-center py-8"><Spinner /></div>
          )}

          {!isLoading && messages.length === 0 && (
            <div className={s.emptyState}>
              <MessageCircle className={s.emptyIcon} />
              <p className={s.emptyTitle}>{t('support.noMessages')}</p>
              <p className={s.emptyText}>{t('support.noMessagesText')}</p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={msg.fromAdmin ? s.messageRowAdmin : s.messageRowUser}>
              <div className={msg.fromAdmin ? s.messageWrapperAdmin : s.messageWrapperUser}>
                {msg.fromAdmin && <p className={s.adminLabel}>{t('support.adminLabel')}</p>}
                <div className={msg.fromAdmin ? s.bubbleAdmin : s.bubbleUser}>
                  {msg.content}
                </div>
                <p className={msg.fromAdmin ? s.messageTime : s.messageTimeUser}>
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
              placeholder={t('support.placeholder')}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <Button className={s.sendButton} onClick={handleSend} disabled={!text.trim() || sendMessage.isPending}>
              {sendMessage.isPending ? <Spinner size="sm" /> : t('support.send')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
