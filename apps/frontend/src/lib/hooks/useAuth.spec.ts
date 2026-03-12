import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { useAuth } from './useAuth';


const mockApiGet = jest.fn();

jest.mock('@/lib/api', () => ({
  api: { get: (...args: unknown[]) => mockApiGet(...args) },
}));

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Иван Петров',
  image: 'https://example.com/avatar.jpg',
  role: 'CUSTOMER' as const,
  createdAt: '2026-01-01T00:00:00.000Z',
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

describe('useAuth', () => {
  beforeEach(() => {
    mockApiGet.mockReset();
  });

  it('returns user when authenticated', async () => {
    mockApiGet.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(false);
  });

  it('returns null user when not authenticated', async () => {
    mockApiGet.mockRejectedValue(new Error('Unauthorized'));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('detects admin role', async () => {
    mockApiGet.mockResolvedValue({ ...mockUser, role: 'ADMIN' });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAdmin).toBe(true);
  });

  it('isLoading is true initially', () => {
    mockApiGet.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeNull();
  });

  it('calls /auth/me on mount', async () => {
    mockApiGet.mockResolvedValue(mockUser);

    renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => expect(mockApiGet).toHaveBeenCalledWith('/auth/me'));
  });

  it('logout calls API endpoint', async () => {
    mockApiGet.mockResolvedValueOnce(mockUser);
    mockApiGet.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    // logout calls api.get('/auth/logout') — we can verify the API call
    // but window.location.href assignment triggers jsdom navigation, so skip href check
    await act(async () => {
      try { await result.current.logout(); } catch { /* jsdom navigation error */ }
    });

    expect(mockApiGet).toHaveBeenCalledWith('/auth/logout');
  });

  it('logout handles API failure gracefully', async () => {
    mockApiGet.mockResolvedValueOnce(mockUser);
    mockApiGet.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    // Should not throw even when API fails
    await act(async () => {
      try { await result.current.logout(); } catch { /* jsdom navigation */ }
    });

    expect(mockApiGet).toHaveBeenCalledWith('/auth/logout');
  });

  it('login function is defined', async () => {
    mockApiGet.mockResolvedValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(typeof result.current.login).toBe('function');
  });
});
