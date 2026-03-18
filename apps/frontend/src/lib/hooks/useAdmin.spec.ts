import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { useCreateProduct, useUpdateProduct } from './useAdmin';


const mockApiPost = jest.fn();
const mockApiPut = jest.fn();

jest.mock('@/lib/api', () => ({
  api: {
    post: (...args: unknown[]) => mockApiPost(...args),
    put: (...args: unknown[]) => mockApiPut(...args),
  },
}));

jest.mock('@/lib/errorReporter', () => ({
  reportAdminError: jest.fn(),
}));


const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  jest.spyOn(queryClient, 'invalidateQueries');
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
  Wrapper.displayName = 'TestWrapper';
  return { Wrapper, queryClient };
};


describe('useUpdateProduct', () => {
  beforeEach(() => {
    mockApiPut.mockReset();
  });

  it('invalidates admin products list after update (regression: table was not refreshing)', async () => {
    mockApiPut.mockResolvedValue({ id: 'p1', name: 'Updated', slug: 'updated' });
    const { Wrapper, queryClient } = createWrapper();

    const { result } = renderHook(() => useUpdateProduct(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate({ id: 'p1', name: 'Updated', slug: 'updated' } as any);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const calls = (queryClient.invalidateQueries as jest.Mock).mock.calls.map((c) => c[0].queryKey);
    expect(calls).toContainEqual(['admin', 'products']);
    expect(calls).toContainEqual(['products']);
    expect(calls).toContainEqual(['product']);
  });
});


describe('useCreateProduct', () => {
  beforeEach(() => {
    mockApiPost.mockReset();
  });

  it('invalidates admin products list after create', async () => {
    mockApiPost.mockResolvedValue({ id: 'p2', name: 'New', slug: 'new' });
    const { Wrapper, queryClient } = createWrapper();

    const { result } = renderHook(() => useCreateProduct(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate({ name: 'New', slug: 'new' } as any);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const calls = (queryClient.invalidateQueries as jest.Mock).mock.calls.map((c) => c[0].queryKey);
    expect(calls).toContainEqual(['admin', 'products']);
    expect(calls).toContainEqual(['products']);
  });
});
