'use client';

import { AppProgressBar } from 'next-nprogress-bar';


export const NavigationProgress = () => (
  <AppProgressBar
    height="2px"
    color="#4361ee"
    options={{ showSpinner: false }}
    shallowRouting
  />
);
