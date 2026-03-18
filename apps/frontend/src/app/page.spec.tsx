jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

import { redirect } from 'next/navigation';
import HomePage from './page';


describe('HomePage', () => {
  it('redirects to /products', () => {
    HomePage();
    expect(redirect).toHaveBeenCalledWith('/products');
  });
});
