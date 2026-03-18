jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

import { redirect } from 'next/navigation';
import AdminPage from './page';


describe('AdminPage', () => {
  it('redirects to /admin/dashboard', () => {
    AdminPage();
    expect(redirect).toHaveBeenCalledWith('/admin/dashboard');
  });
});
