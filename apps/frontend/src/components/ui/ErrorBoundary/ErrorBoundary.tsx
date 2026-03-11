import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { s } from './ErrorBoundary.styled';
import type { ErrorBoundaryProps, ErrorBoundaryState } from './ErrorBoundary.types';


const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';


export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    void fetch(`${API_URL}/api/logs`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      }),
    }).catch(() => {});
    console.error('[ErrorBoundary]', error, info);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={s.page}>
          <AlertTriangle className={s.icon} />
          <h2 className={s.title}>Что-то пошло не так</h2>
          <p className={s.message}>
            Произошла непредвиденная ошибка. Попробуйте обновить страницу или вернуться позже.
          </p>
          <Button className={s.button} onClick={this.handleReload}>
            Попробовать снова
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
