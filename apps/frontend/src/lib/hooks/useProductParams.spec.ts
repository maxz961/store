import { renderHook, act } from '@testing-library/react';
import { useProductParams } from './useProductParams';


const mockPush = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}));

describe('useProductParams', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockSearchParams = new URLSearchParams();
  });

  describe('get', () => {
    it('returns undefined for missing param', () => {
      const { result } = renderHook(() => useProductParams());
      expect(result.current.get('search')).toBeUndefined();
    });

    it('returns value for existing param', () => {
      mockSearchParams = new URLSearchParams('search=laptop');
      const { result } = renderHook(() => useProductParams());
      expect(result.current.get('search')).toBe('laptop');
    });
  });

  describe('update', () => {
    it('sets a string param', () => {
      const { result } = renderHook(() => useProductParams());
      act(() => result.current.update({ search: 'phone' }));
      expect(mockPush).toHaveBeenCalledWith('/products?search=phone');
    });

    it('removes param when value is undefined', () => {
      mockSearchParams = new URLSearchParams('search=laptop&categorySlug=electronics');
      const { result } = renderHook(() => useProductParams());
      act(() => result.current.update({ search: undefined }));
      expect(mockPush).toHaveBeenCalledWith('/products?categorySlug=electronics');
    });

    it('joins array values with comma', () => {
      const { result } = renderHook(() => useProductParams());
      act(() => result.current.update({ tagSlugs: ['new', 'sale'] }));
      expect(mockPush).toHaveBeenCalledWith('/products?tagSlugs=new%2Csale');
    });

    it('removes param for empty array', () => {
      mockSearchParams = new URLSearchParams('tagSlugs=new');
      const { result } = renderHook(() => useProductParams());
      act(() => result.current.update({ tagSlugs: [] }));
      expect(mockPush).toHaveBeenCalledWith('/products?');
    });

    it('always resets page param', () => {
      mockSearchParams = new URLSearchParams('page=3&categorySlug=electronics');
      const { result } = renderHook(() => useProductParams());
      act(() => result.current.update({ search: 'test' }));
      expect(mockPush).toHaveBeenCalledWith('/products?categorySlug=electronics&search=test');
    });
  });

  describe('reset', () => {
    it('navigates to /products without params', () => {
      mockSearchParams = new URLSearchParams('search=laptop&categorySlug=electronics&tagSlugs=new');
      const { result } = renderHook(() => useProductParams());
      act(() => result.current.reset());
      expect(mockPush).toHaveBeenCalledWith('/products');
    });
  });
});
